import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app/app.module'

if (String('<%= ENV %>') === 'prod') { enableProdMode() }

// http://stackoverflow.com/questions/38948463/passing-server-parameters-to-ngmodule-after-rc5-upgrade
export function main(instance : any) {
  platformBrowserDynamic( [{provide: 'openerp', useValue: instance }])
  .bootstrapModule(AppModule)
}
