"""QA real. Requer Playwright Python e navegador Chromium local, sem instalação automática."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import threading
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ROUTES = ['', 'projetos/tcc/', 'projetos/odoo/', 'projetos/baterias/', 'projetos/dieta/']

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *_): pass
    def translate_path(self, path):
        if path.startswith('/previa/'): path = path[len('/previa'):]
        return super().translate_path(path)

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--browser',required=True)
    parser.add_argument('--artifacts',required=True)
    args=parser.parse_args()
    artifacts=Path(args.artifacts).resolve()
    if artifacts == ROOT or ROOT in artifacts.parents: raise ValueError('Artefatos de QA devem ficar fora do repositório.')
    artifacts.mkdir(parents=True,exist_ok=True)
    checks=[]
    def check(name,condition,detail=''):
        checks.append({'name':name,'pass':bool(condition),'detail':detail})
        if not condition: print('FALHA:',name,detail,flush=True)
    service=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
    threading.Thread(target=service.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{service.server_port}'
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path=args.browser,headless=True)
        context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
        page=context.new_page(); errors=[]; unexpected=[]; environmental=set()
        page.on('pageerror',lambda error: errors.append(str(error)))
        def request_audit(req):
            host=urlparse(req.url).hostname
            if host and host.endswith('.kaspersky-labs.com'): environmental.add(host)
            elif host not in ('127.0.0.1',None): unexpected.append(host)
        page.on('request',request_audit)
        page.goto(base+'/tests/interface.html')
        page.wait_for_function('window.testResults')
        for r in page.evaluate('testResults'): check('Modelo: '+r['name'],r['pass'])
        for theme in ('escuro','claro'):
          page.evaluate('(theme)=>localStorage.setItem("caio-portfolio-theme",theme)',theme)
          for route in ROUTES:
            for width in (320,390,768,1280,1440):
              page.set_viewport_size({'width':width,'height':1000})
              response=page.goto(base+'/'+route)
              page.wait_for_function('document.fonts.status === "loaded"')
              label=f'{route or "/"} {theme} {width}'
              check('Rota '+label,response.status==200 and page.locator('h1').count()==1)
              check('Sem overflow '+label,page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'))
              check('Tema '+label,page.locator('html').get_attribute('data-theme')==theme)
              check('Imagens '+label,page.evaluate('[...document.images].filter(i=>i.getAttribute("src")).every(i=>i.complete && i.naturalWidth>0)'))
              if route=='projetos/baterias/':
                check('Painéis internos '+label,page.evaluate('[...document.querySelectorAll(".calculator-form,.calculator-results,.field-grid,.result-cards,.ratio-control")].every(e=>e.scrollWidth<=e.clientWidth+1)'))
                check('Controles não cortados '+label,page.evaluate('(()=>{const r=document.querySelector("#calculator").getBoundingClientRect();return [...document.querySelectorAll("#calculator input,#calculator select,.result-card")].filter(e=>e.getBoundingClientRect().width).every(e=>e.getBoundingClientRect().right<=r.right+1)})()'))
              if route=='projetos/odoo/':
                check('Diagramas Amara não cortados '+label,page.evaluate('[...document.querySelectorAll(".amara-diagram,.amara-layers,.amara-demo-body,.amara-deliveries")].every(e=>e.scrollWidth<=e.clientWidth+1)'))
              if width in (390,1440):
                name=(route.replace('/','-') or 'inicio')+f'-{theme}-{width}'
                page.screenshot(path=str(artifacts/(name+'.png')),full_page=route!='projetos/baterias/')
                if route=='projetos/baterias/':
                    page.evaluate('document.activeElement.blur()')
                    page.locator('#calculator').screenshot(path=str(artifacts/(name+'-calculadora.png')),style='.mobile-header,.skip-link{visibility:hidden!important}')
          print('Layout concluído:',theme,flush=True)
        page.set_viewport_size({'width':1440,'height':1000})
        page.goto(base+'/projetos/baterias/')
        for i,expected in enumerate(('4.128,32','3.001,60','2.231,04','1.157,17')):
            page.select_option('#scenario',str(i));check('Preset UI '+str(i),expected in page.locator('#result-annual').inner_text())
            check('Sliders sincronizados preset '+str(i),page.evaluate('Object.keys(BESS.fields).every(k=>Math.abs(Number(document.getElementById(k).value)-Number(document.getElementById("range-"+k).value))<1e-9)'))
        page.fill('#efficiency','0')
        check('Eficiência inválida remove resultados',page.locator('#form-error').is_visible() and page.locator('#result-annual').count()==0)
        page.fill('#efficiency','90');page.fill('#daily','')
        check('Campo vazio mostra erro',page.locator('#form-error').is_visible())
        page.fill('#daily','8');page.select_option('#scenario','0');page.fill('#ratio-number','20')
        check('Relação atualiza preço',abs(float(page.input_value('#offpeak'))-.494)<1e-9)
        page.fill('#offpeak','.38')
        check('Preço atualiza relação',abs(float(page.input_value('#ratio-number'))-.38/2.47*100)<1e-6)
        page.locator('#range-daily').evaluate('(e)=>{e.value="4";e.dispatchEvent(new Event("input",{bubbles:true}))}')
        check('Slider sincroniza campo',page.input_value('#daily')=='4' and '2.064,16' in page.locator('#result-annual').inner_text())
        page.click('#reset-calc')
        check('Reset recupera cenário',page.input_value('#daily')=='8' and page.input_value('#offpeak')=='0.38')
        page.fill('#years','1')
        check('Horizonte curto não recupera',page.locator('#result-recovery').inner_text()=='Não ocorre')
        page.click('#reset-calc');context.grant_permissions(['clipboard-read','clipboard-write'])
        page.click('#copy-result');copied=page.evaluate('navigator.clipboard.readText()')
        check('Resumo copiável','4.128,32' in copied and 'Investimento instalado' in copied)
        page.click('#share-result');shared=page.evaluate('navigator.clipboard.readText()');page.goto(shared)
        check('Link reconstitui cenário','4.128,32' in page.locator('#result-annual').inner_text() and page.input_value('#investment')=='20000')
        with page.expect_download() as download: page.click('#export-csv')
        destination=artifacts/'cenario-bess.csv';download.value.save_as(destination)
        exported=destination.read_text(encoding='utf-8-sig')
        check('CSV com premissas e fluxos','Investimento instalado' in exported and 'Acumulado descontado R$' in exported and '4128.32' in exported)
        page.goto(base+'/projetos/baterias/?efficiency=0')
        check('URL inválida tratada',page.locator('#form-error').is_visible())
        page.goto(base+'/projetos/odoo/');page.click('[data-stage="4"]')
        check('Odoo navega etapas','PED-DEMO-001' in page.locator('#process-stage').inner_text())
        page.click('#process-reset');check('Odoo reset','Registrar o contexto' in page.locator('#process-stage').inner_text())
        check('Dois projetos da Amara presentes',page.locator('#power-automate').is_visible() and page.locator('#odoo').is_visible())
        page.click('[data-sales-view="items"]')
        check('Visão por item abre detalhamento',page.locator('[data-sales-panel="items"]').is_visible() and not page.locator('[data-sales-panel="offer"]').is_visible())
        check('Exemplo preserva a mesma oferta',page.locator('[data-sales-panel="items"] tbody tr').count()==2 and page.locator('[data-sales-panel="items"] tbody td:first-child').all_text_contents()==['OF-DEMO','OF-DEMO'])
        check('Soma dos itens coincide com o resumo comercial',page.evaluate('''()=>{const n=t=>Number(t.replace(/[^0-9,.-]/g,"").replaceAll(".","").replace(",","."));const rows=[...document.querySelectorAll('[data-sales-panel="items"] tbody tr')];const values=[...document.querySelectorAll('.amara-offer dd')];const sales=rows.reduce((s,r)=>s+n(r.cells[3].textContent),0);const costs=rows.reduce((s,r)=>s+n(r.cells[4].textContent),0);return Math.abs(sales-n(values[1].textContent))<0.001 && Math.abs(costs-n(values[2].textContent))<0.001 && Math.abs((sales-costs)/sales*100-n(values[3].textContent))<0.001;}'''))
        check('Estado acessível acompanha o detalhamento',page.locator('[data-sales-view="items"]').get_attribute('aria-pressed')=='true')
        page.click('#sales-reset')
        check('Reset comercial restaura visão e foco',page.locator('[data-sales-panel="offer"]').is_visible() and page.evaluate('document.activeElement.dataset.salesView')=='offer')
        page.keyboard.press('Tab');page.keyboard.press('Enter')
        check('Detalhamento funciona por teclado',page.locator('[data-sales-panel="items"]').is_visible())
        page.goto(base+'/projetos/dieta/');page.click('#diet-save');snapshot=page.locator('#diet-history').inner_text()
        page.locator('#diet-0').evaluate('(e)=>{e.value="200";e.dispatchEvent(new Event("input",{bubbles:true}))}')
        check('Dieta calcula proporcionalmente',page.locator('[data-nutrient="kcal"]').inner_text()=='500')
        check('Snapshot mantém registro',page.locator('#diet-history').inner_text()==snapshot and '380' in snapshot)
        page.click('#diet-reset');check('Dieta reset',page.locator('[data-nutrient="kcal"]').inner_text()=='380' and 'Nenhum' in page.locator('#diet-history').inner_text())
        page.goto(base+'/projetos/tcc/');page.click('[data-figure="cubo"]')
        check('TCC alterna figura',page.locator('[data-figure-panel="cubo"]').is_visible() and not page.locator('[data-figure-panel="curvas"]').is_visible())
        page.click('[data-zoom="Cubo de configurações"]');check('Zoom abre diálogo',page.locator('dialog').is_visible())
        page.keyboard.press('Escape');check('Escape fecha diálogo',not page.locator('dialog').is_visible())
        check('Foco retorna ao zoom',page.evaluate('document.activeElement.hasAttribute("data-zoom")'))
        page.set_viewport_size({'width':390,'height':844});page.goto(base+'/')
        check('Menu fechado não recebe foco',page.locator('.sidebar').evaluate('(e)=>e.inert'))
        page.click('#menu-toggle');check('Menu abre com foco',page.locator('#menu-toggle').get_attribute('aria-expanded')=='true' and page.evaluate('document.querySelector(".sidebar").contains(document.activeElement)'))
        page.keyboard.press('Shift+Tab');check('Menu contém foco',page.evaluate('document.querySelector(".sidebar").contains(document.activeElement)'))
        page.keyboard.press('Escape');check('Escape fecha menu e restaura foco',page.locator('#menu-toggle').get_attribute('aria-expanded')=='false' and page.evaluate('document.activeElement.id')=='menu-toggle')
        page.locator('.mobile-header [data-theme-toggle]').click();theme=page.locator('html').get_attribute('data-theme')
        page.goto(base+'/projetos/dieta/');check('Tema persiste entre páginas',page.locator('html').get_attribute('data-theme')==theme)
        page.goto(base+'/previa/projetos/baterias/');check('Subpasta carrega calculadora','4.128,32' in page.locator('#result-annual').inner_text())
        page.reload();check('Recarga direta funciona',page.locator('#calculator').is_visible())
        page.goto(base+'/assets/images/compartilhar.svg');page.set_viewport_size({'width':1200,'height':630})
        page.screenshot(path=str(ROOT/'assets/images/compartilhar.png'))
        check('Sem erros JavaScript',not errors,repr(errors));check('Sem chamadas externas do aplicativo',not unexpected,repr(sorted(set(unexpected))))
        nojs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844});nj=nojs.new_page()
        for route in ROUTES:
            nj.goto(base+'/'+route);check('Sem JS mantém conteúdo '+route,nj.locator('h1').count()==1 and nj.locator('.sidebar-nav').is_visible())
            if route=='projetos/odoo/': check('Sem JS mantém exemplo por item',nj.locator('[data-sales-panel="items"]').is_visible())
        browser.close()
    finally:
        service.shutdown()
        report={'passed':sum(c['pass'] for c in checks),'total':len(checks),'checks':checks,'environmental_hosts':sorted(environmental),'environment_note':'Antivírus local injetou requisições, separadas das requisições do aplicativo. Nenhuma configuração do antivírus foi alterada.'}
        (artifacts/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
        print(f"{report['passed']}/{report['total']} verificações aprovadas. Relatório: {artifacts/'qa.json'}",flush=True)
    if report['passed']!=report['total']: raise SystemExit(1)

if __name__=='__main__': main()
