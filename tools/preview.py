"""Prévia local. Serve somente este repositório em loopback e abre o navegador."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser

ROOT=Path(__file__).resolve().parents[1]

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--port',type=int,default=8765)
    parser.add_argument('--no-browser',action='store_true')
    args=parser.parse_args()
    handler=partial(SimpleHTTPRequestHandler,directory=str(ROOT))
    try:
        server=ThreadingHTTPServer(('127.0.0.1',args.port),handler)
    except OSError:
        server=ThreadingHTTPServer(('127.0.0.1',0),handler)
    url=f'http://127.0.0.1:{server.server_port}/'
    print(f'Prévia: {url}\nPara encerrar, pressione Ctrl+C ou feche esta janela.',flush=True)
    if not args.no_browser: webbrowser.open(url)
    try: server.serve_forever()
    except KeyboardInterrupt: pass
    finally: server.server_close()

if __name__=='__main__': main()
