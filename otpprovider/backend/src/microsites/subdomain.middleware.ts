import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response, NextFunction } from 'express';
import { MicroSitesService } from './microsites.service';

/**
 * Detects whether an incoming request's Host header is a managed sub-domain
 * (e.g. promo.otpprovider.com) and, if so, renders that page directly from
 * the database and ends the response there.
 *
 * Runs before Nest's router, so it works for every path on that host and
 * needs no reverse-proxy path rewriting - point any host at this service
 * (Render, a VPS, wherever) and this handles the split itself.
 *
 * Requests to the root domain, www, platform-assigned hostnames
 * (*.onrender.com, localhost, etc.) fall through to next() untouched, so
 * the normal dashboard/API routing is unaffected.
 */
@Injectable()
export class SubdomainMiddleware implements NestMiddleware {
  constructor(
    private microSitesService: MicroSitesService,
    private config: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const rootDomain = this.config.get<string>('ROOT_DOMAIN') || 'otpprovider.com';
    const subdomain = this.extractSubdomain(req.headers.host, rootDomain);

    if (!subdomain) {
      return next();
    }

    const site = await this.microSitesService.findPublishedBySubdomain(subdomain);
    if (!site) {
      res.status(404).send(this.notFoundPage(subdomain));
      return;
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(this.buildPage(site));
  }

  private extractSubdomain(host: string | undefined, rootDomain: string): string | null {
    if (!host) return null;
    const hostname = host.split(':')[0].toLowerCase();
    if (hostname === rootDomain || hostname === `www.${rootDomain}`) return null;
    if (!hostname.endsWith(`.${rootDomain}`)) return null;
    return hostname.slice(0, -1 * (`.${rootDomain}`.length));
  }

  private escapeHtml(unsafe: string) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private notFoundPage(subdomain: string) {
    return `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:4rem">
      <h1>404</h1><p>No published page for "${this.escapeHtml(subdomain)}".</p></body></html>`;
  }

  private buildPage(site: {
    title: string;
    metaDescription: string | null;
    htmlContent: string;
    customCss: string | null;
    customJs: string | null;
  }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${this.escapeHtml(site.title)}</title>
  ${site.metaDescription ? `<meta name="description" content="${this.escapeHtml(site.metaDescription)}" />` : ''}
  <style>${site.customCss || ''}</style>
</head>
<body>
${site.htmlContent}
${site.customJs ? `<script>${site.customJs}</script>` : ''}
</body>
</html>`;
  }
}
