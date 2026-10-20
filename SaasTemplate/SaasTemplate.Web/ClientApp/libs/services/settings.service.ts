// Angular modules
import { Injectable } from '@angular/core';

// Project modules
import { Constants } from '@Workspace/common';
import { environment } from 'src/environments/environment';

@Injectable()
export class SettingsService {
  private baseUrl = environment.apiUrl;

  // Public methods

  public createApiUrl(path: string): string {
    return this.createUrl(this.baseUrl + '/api/', path);
  }

  // Private methods

  private createUrl(root: string, path: string): string {
    root = this.getUrl(root);

    if (path.indexOf('/') === 0) {
      path = path.substr(1);
    }

    return root + path;
  }

  private getUrl(url: string): string {
    if (!!url && url.lastIndexOf('/') !== url.length - 1) {
      url = url + '/';
    }

    if (!url) {
      url = '';
    }

    return url;
  }
}
