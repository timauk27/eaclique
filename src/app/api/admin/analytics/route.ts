import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Instantiate the GA4 client.
// This requires the following environment variables to be set:
// - GOOGLE_APPLICATION_CREDENTIALS (path to JSON file)
//   OR
// - GA_CLIENT_EMAIL and GA_PRIVATE_KEY
let analyticsDataClient: BetaAnalyticsDataClient | null = null;

try {
    if (process.env.GA_CLIENT_EMAIL && process.env.GA_PRIVATE_KEY) {
        // Formata a chave privada se ela vier sem quebras de linha reais
        const formattedPrivateKey = process.env.GA_PRIVATE_KEY.replace(/\\n/g, '\n');

        analyticsDataClient = new BetaAnalyticsDataClient({
            credentials: {
                client_email: process.env.GA_CLIENT_EMAIL,
                private_key: formattedPrivateKey,
            },
        });
    } else {
        console.warn('Google Analytics credentials are not set. API will return mock/empty data.');
    }
} catch (error) {
    console.error('Failed to initialize GA4 Client:', error);
}

export async function GET() {
    const propertyId = process.env.GA_PROPERTY_ID;

    if (!analyticsDataClient || !propertyId) {
        return NextResponse.json({
            error: 'Google Analytics não está configurado. Por favor, adicione GA_CLIENT_EMAIL, GA_PRIVATE_KEY e GA_PROPERTY_ID no seu arquivo .env.local.',
            isConfigured: false,
            data: {
                activeUsers: 0,
                views: 0,
                topPages: [],
                sources: []
            }
        }, { status: 200 }); // Returning 200 so the frontend can handle the "Not Configured" state gracefully
    }

    try {
        // Run a real time report for active users (last 30 minutes)
        const [realtimeResponse] = await analyticsDataClient.runRealtimeReport({
            property: `properties/${propertyId}`,
            metrics: [{ name: 'activeUsers' }],
        });

        // Run a report for basic stats (last 7 days)
        const [reportResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [{ name: 'screenPageViews' }],
        });

        // Run a report for top pages (last 7 days)
        const [pagesResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'pageTitle' }, { name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }],
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 5,
        });

        // Run a report for traffic sources (last 7 days)
        const [sourcesResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'sessionSourceMedium' }],
            metrics: [{ name: 'totalUsers' }],
            orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
            limit: 5,
        });

        // Parse Results
        const activeUsers = realtimeResponse.rows?.[0]?.metricValues?.[0]?.value || '0';
        const totalViews = reportResponse.rows?.[0]?.metricValues?.[0]?.value || '0';

        const topPages = pagesResponse.rows?.map(row => ({
            title: row.dimensionValues?.[0]?.value || 'Sem título',
            path: row.dimensionValues?.[1]?.value || '/',
            views: parseInt(row.metricValues?.[0]?.value || '0', 10),
        })) || [];

        const sources = sourcesResponse.rows?.map(row => ({
            source: row.dimensionValues?.[0]?.value || 'Direct',
            users: parseInt(row.metricValues?.[0]?.value || '0', 10),
        })) || [];

        return NextResponse.json({
            isConfigured: true,
            data: {
                activeUsers: parseInt(activeUsers, 10),
                views: parseInt(totalViews, 10),
                topPages,
                sources
            }
        });

    } catch (error: any) {
        console.error('GA4 API Error:', error);
        return NextResponse.json({
            error: 'Erro ao buscar dados do Google Analytics.',
            details: error.message
        }, { status: 500 });
    }
}
