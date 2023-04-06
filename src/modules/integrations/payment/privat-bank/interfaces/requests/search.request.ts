export class SearchRequest {
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
          presearchId: string;
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
