import urllib.request
import ssl
import re
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def inspect_url(name, url):
    print(f"\n==================================================")
    print(f"INSPECTING SOURCE: {name}")
    print(f"URL: {url}")
    print(f"==================================================")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as res:
            html = res.read().decode('utf-8', errors='ignore')
            print(f"Status Code: {res.status}")
            print(f"Content Length: {len(html)} bytes")
            
            # Find downloadable resources
            hrefs = set(re.findall(r'href=[\"\'](.*?)[\"\']', html))
            srcs = set(re.findall(r'src=[\"\'](.*?)[\"\']', html))
            all_links = hrefs.union(srcs)
            
            relevant_links = []
            for link in all_links:
                link_lower = link.lower()
                if any(ext in link_lower for ext in ['.pdf', '.zip', '.shp', '.geojson', '.gpkg', '.tif', '.csv', '.json', 'download', 'resource', 'wms', 'wcs', 'api']):
                    relevant_links.append(link)
            
            print(f"Relevant Resource Links Found ({len(relevant_links)}):")
            for r in sorted(relevant_links)[:20]:
                print(f"  - {r}")
                
    except Exception as e:
        print(f"ERROR accessing {url}: {e}")

if __name__ == '__main__':
    inspect_url("ASDMA Assam Inundation Mapping", "https://asdma.assam.gov.in/resource/inundation-mapping-nrsc")
    inspect_url("NRSC Bhuvan Flood Portal", "https://bhuvan-app1.nrsc.gov.in/disaster/usrtasks/flood/flood.php")
    inspect_url("CWC NWIC Hourly Rainfall", "https://www.nwdp.nwic.gov.in/en/dataset/rainfall-cwc-telemetry-hourly")
    inspect_url("CWC NWIC River Water Level", "https://www.nwdp.nwic.gov.in/en/dataset/river-water-level-telemetry-hourly-central-water-commission-cwc")
    inspect_url("IMD National Flash Flood Guidance", "https://hydro.imd.gov.in/national/")
