import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';


export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({ providedIn: 'root' })
export class PendingChangesGuard
  
{
  canDeactivate(
    component: ComponentCanDeactivate,
  ): boolean | Observable<boolean> {
    // if there are no pending changes, just allow deactivation; else confirm first
    return component.canDeactivate()
      ? true
      : // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
        // when navigating away from your angular app, the browser will show a generic warning message
        // see http://stackoverflow.com/a/42207299/7307355
        confirm(
          'У вас є незбережені зміни. Ви впевнені, що хочете залишити цю сторінку?',
        );
  }
}
