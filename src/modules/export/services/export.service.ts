import { Response } from 'express';
import * as xlsx from 'xlsx';

import { Injectable } from '@nestjs/common';

interface ExportExcelOptions {
  filename: string;
  sheetName: string;
  columns: string[];
  data: any[];
  columnWidths?: number[];
}

@Injectable()
export class ExportService {
  exportExcel(options: ExportExcelOptions, res: Response) {
    const data = [options.columns, ...options.data];

    // Create a workbook with a worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(data);

    if (options.columnWidths) {
      options.columnWidths.forEach((width, columnIndex) => {
        const colIndex = xlsx.utils.decode_col(
          xlsx.utils.encode_col(columnIndex),
        );
        worksheet['!cols'] = worksheet['!cols'] || [];
        worksheet['!cols'][colIndex] = { width };
      });
    }

    // Add the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, options.sheetName);

    // Save the workbook to a buffer
    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Set the response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${options.filename}.xlsx`,
    );
    res.setHeader('Content-Length', buffer.length);

    // Send the buffer as the response
    res.send(buffer);
  }
}
