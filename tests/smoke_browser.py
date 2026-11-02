"""Prueba local de CreatorRing: NO conecta con el Supabase verdadero.

Requisitos opcionales: Python + playwright, Chromium instalado.
Ejecutar desde la carpeta creatorring: python3 tests/smoke_browser.py
"""
import re
import pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]

# Mock de la API: replica select/insert/update/delete/eq y Auth en memoria.
MOCK = r'''
(() => {
  const clone = x => JSON.parse(JSON.stringify(x));
  const db = {
    peleadores: [
      {id:1, slug:'peleador-prueba-001', nombre_real:'Carlos Prueba', alias:'El Demo', pais:'México', record:'0-0-0', foto:null,
       instagram:'',tiktok:'',youtube:'',twitter:''},
    ],
    combates: [
      {id:1, peleador_id:1, evento_id:1, oponente:'Juan Prueba', resultado:'Victoria', metodo:'KO', fecha:'2026-10-20', video:null}
    ],
    eventos: [{id:1, nombre:'Prueba de evento', fecha:'2027-10-20', organizador:'Organizador', lugar:'México', descripcion:''}]
  };
  window.__db = db;
  class Query {
    constructor(t) { this.t=t; this.act='select'; this.payload=null; this.filters=[]; this.sortKey=null; }
    select() { return this; }
    order(c,opts={}) { this.sortKey=c; this.ascending=opts.ascending!==false; return this; }
    insert(row) { this.act='insert'; this.payload=clone(row); return this; }
    update(row) { this.act='update'; this.payload=clone(row); return this; }
    delete() { this.act='delete'; return this; }
    eq(col, val) { this.filters.push([col,val]); return this; }
    then(resolve,reject) {
      try {
        const arr=db[this.t];
        let matches=arr.filter(x=>this.filters.every(([col,val])=>String(x[col])===String(val)));
        if(this.act==='insert') { arr.push({...this.payload, id:Math.max(0,...arr.map(x=>x.id))+1}); }
        if(this.act==='update') { matches.forEach(x=>Object.assign(x,this.payload)); }
        if(this.act==='delete') { matches.forEach(x=>arr.splice(arr.indexOf(x),1)); }
        if(this.sortKey) matches.sort((a,b)=>this.ascending?String(a[this.sortKey]??'').localeCompare(String(b[this.sortKey]??'')):String(b[this.sortKey]??'').localeCompare(String(a[this.sortKey]??'')));
        return Promise.resolve({data:clone(matches),error:null}).then(resolve,reject);
      } catch(e) {return Promise.reject(e).then(resolve,reject);}
    }
  }
  window.supabase = { createClient: () => ({
    from: (table) => new Query(table),
    auth: {getUser: async()=>({data:{user:{id:'admin'}}}), signOut:async()=>({error:null}),signInWithPassword:async()=>({error:null})},
    rpc: async()=>({data:true,error:null})
  })};
})();
'''

def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page()
        errors = []
        page.on('pageerror', lambda exc: errors.append(str(exc)))

        def cargar_html(ruta, scripts):
            # Este entorno bloquea la navegación: se cargan archivos locales en memoria.
            html = (ROOT / ruta).read_text()
            html = re.sub(r'<script\s+src="[^"]+"\s*></script>', '', html)
            page.set_content(html)
            page.evaluate(MOCK)
            css = 'admin/admin.css' if ruta.startswith('admin/') else 'style.css'
            page.add_style_tag(content=(ROOT / css).read_text())
            for ruta_js in scripts:
                page.add_script_tag(content=(ROOT / ruta_js).read_text())

        cargar_html('index.html', ['supabase-config.js', 'peleadores.js', 'script.js'])
        page.get_by_text('El Demo').first.wait_for()
        assert page.locator('#fightersTableBody tr').count() >= 2, 'Catálogo local + demo'
        page.locator('#searchInput').fill('Carlos')
        assert page.locator('#fightersTableBody tr').count() == 1, 'Búsqueda'
        page.get_by_role('button', name='Ver ficha').click()
        assert page.get_by_text('Juan Prueba').count() == 1, 'Combate de Supabase'
        assert page.get_by_text('Prueba de evento').count() >= 1, 'Evento relacionado'
        assert page.get_by_text('Sin video').count() == 1, 'Video no disponible'
        assert page.locator('#profileSocials a').count() == 0, 'Enlaces vacíos ocultos'
        page.close()

        page = browser.new_page()
        page.on('pageerror', lambda exc: errors.append(str(exc)))
        cargar_html('admin/panel.html', ['supabase-config.js', 'admin/admin.js'])
        page.locator('#listaPeleadores tr').first.wait_for()
        assert page.locator('#panel').is_visible(), 'Login de administrador'
        page.locator('#slug').fill('nueva-prueba')
        page.locator('#alias').fill('Nuevo')
        page.locator('#guardarPeleador').click()
        page.get_by_text('✅ Peleador registrado.').wait_for()
        assert len(page.evaluate('window.__db.peleadores')) == 2
        fila = page.locator('#listaPeleadores tr').filter(has_text='nueva-prueba')
        fila.get_by_role('button', name='Editar').click()
        page.locator('#alias').fill('Nuevo actualizado')
        page.locator('#guardarPeleador').click()
        page.get_by_text('✅ Peleador actualizado.').wait_for()
        assert page.evaluate('window.__db.peleadores[1].alias') == 'Nuevo actualizado'
        page.get_by_role('button', name='🏆 Combates').click()
        assert page.locator('#combatePeleador option').count() == 3
        page.locator('#combatePeleador').select_option(label='Nuevo actualizado')
        page.locator('#combateOponente').fill('Rival de prueba')
        page.locator('#combateResultado').select_option(label='Victoria')
        page.locator('#guardarCombate').click()
        page.get_by_text('✅ Combate registrado.').wait_for()
        assert len(page.evaluate('window.__db.combates')) == 2
        page.get_by_role('button', name='📅 Eventos').click()
        page.locator('#eventoNombre').fill('Nuevo torneo')
        page.locator('#guardarEvento').click()
        page.get_by_text('✅ Evento registrado.').wait_for()
        assert len(page.evaluate('window.__db.eventos')) == 2
        page.on('dialog', lambda dialog: dialog.accept())
        page.locator('#listaEventos tr').filter(has_text='Nuevo torneo').get_by_role('button', name='Eliminar').click()
        page.get_by_text('✅ Evento eliminado.').wait_for()
        assert len(page.evaluate('window.__db.eventos')) == 1
        assert not errors, f'Errores JavaScript: {errors}'
        print('OK: catálogo, búsqueda, perfiles, video, autorización simulada y CRUD')
        browser.close()

if __name__=='__main__': main()
