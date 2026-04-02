import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FileUpload,
  FileRemoveEvent,
  FileSelectEvent,
  FileUploadHandlerEvent,
} from 'primeng/fileupload';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FileUploadComponent implements OnDestroy {
  @ViewChild(FileUpload) private readonly fileUpload?: FileUpload;

  @Input() name?: string;
  @Input() accept?: string;
  @Input() disabled = false;
  @Input() multiple = false;
  @Input() auto = true;
  @Input() customUpload = true;
  @Input() maxFileSize?: number;
  @Input() chooseLabel = 'Вибрати';
  @Input() invalidFileTypeMessageDetail = '';
  @Input() invalidFileSizeMessageDetail = '';
  @Input() invalidFileSizeMessageSummary = '';
  @Input() dataCy?: string;
  @Input() emptyMessage = 'Перетягніть файл для завантаження';
  @Input() variant: 'image' | 'file' = 'file';

  @Output() uploadHandler = new EventEmitter<FileUploadHandlerEvent>();
  @Output() onRemove = new EventEmitter<FileRemoveEvent>();
  @Output() onSelect = new EventEmitter<FileSelectEvent>();

  private readonly previewUrls = new Map<File, string>();

  clear(): void {
    this.fileUpload?.clear();
  }

  ngOnDestroy(): void {
    this.previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    this.previewUrls.clear();
  }

  emitUpload(event: FileUploadHandlerEvent): void {
    this.uploadHandler.emit(event);
  }

  emitRemove(event: FileRemoveEvent): void {
    this.revokePreviewUrl(event.file);
    this.onRemove.emit(event);
  }

  emitSelect(event: FileSelectEvent): void {
    this.onSelect.emit(event);
  }

  isImage(file: File): boolean {
    return this.variant === 'image' && file.type.startsWith('image/');
  }

  getPreviewUrl(file: File): string {
    const existingPreviewUrl = this.previewUrls.get(file);
    if (existingPreviewUrl) {
      return existingPreviewUrl;
    }

    const previewUrl = URL.createObjectURL(file);
    this.previewUrls.set(file, previewUrl);

    return previewUrl;
  }

  formatFileSize(size: number): string {
    if (size < 1024) {
      return `${size} B`;
    }

    const units = ['KB', 'MB', 'GB'];
    let value = size / 1024;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }

    return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[unitIndex]}`;
  }

  private revokePreviewUrl(file: File): void {
    const previewUrl = this.previewUrls.get(file);
    if (!previewUrl) {
      return;
    }

    URL.revokeObjectURL(previewUrl);
    this.previewUrls.delete(file);
  }
}
