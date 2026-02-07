import adsConfig from '@/config/ads.json';

export interface AdConfig {
    network: string;
    active: boolean;
    position: string;
    format: string;
    description: string;
    key: string;
    renderType: 'iframe' | 'script';
}

type AdPosition = 'billboard' | 'skyscraper' | 'in_article' | 'sticky_footer';

/**
 * Hook to get ad configuration from JSON
 * Returns null if ad is inactive or position doesn't exist
 */
export function useAdConfig(position: AdPosition): AdConfig | null {
    const config = adsConfig[position as keyof typeof adsConfig] as AdConfig;

    if (!config || !config.active) {
        return null;
    }

    return config;
}

/**
 * Generate Adsterra iframe code
 */
export function generateAdsterraCode(config: AdConfig): string {
    const { key, format } = config;
    const [width, height] = format.split('x').map(Number);

    return `
    <html>
      <body style="margin:0;padding:0;overflow:hidden;">
        <script type="text/javascript">
          atOptions = {
            'key' : '${key}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="//www.highperformanceformat.com/ad80144040dc1bf67996553ea5bf90a2/invoke.js"></script>
      </body>
    </html>
  `.replace(/"/g, "'");
}
