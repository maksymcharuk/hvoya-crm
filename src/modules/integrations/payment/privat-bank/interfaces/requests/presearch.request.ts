export class PresearchRequest {
  transfer: {
    $: {
      xmls: string;
      interface: string;
      action: string;
    }
    data: [
      {
        $: {
          'xmlns:xsi': string;
          'xsi:type': string;
        }
        unit: [
          {
            $: {
              name: string;
              value: string;
            }
          }
        ]
      }
    ]
  }
}
