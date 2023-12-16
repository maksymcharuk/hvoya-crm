import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import { FileFormat } from '@shared/enums/file-format.enum';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  downloadBlob(
    data: Blob,
    filename: string,
    format: FileFormat,
  ): Observable<void> {
    return new Observable((observer) => {
      try {
        // Create a blob URL for the downloaded file
        const blob = new Blob([data], { type: this.getTypeFromFormat(format) });
        const url = window.URL.createObjectURL(blob);

        // Create a link element and click it to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Release the blob URL
        window.URL.revokeObjectURL(url);

        observer.next();
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  private getTypeFromFormat(format: FileFormat): string {
    switch (format) {
      case FileFormat.XLSX:
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default:
        throw new Error(`Unknown file format: ${format}`);
    }
  }
}
