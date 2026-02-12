import time
import feedparser
import os
import requests
from supabase import create_client, Client
from bs4 import BeautifulSoup
import ollama
import random
from datetime import datetime
import re
import json
import urllib.parse
from colorama import init, Fore, Style, Back

# --- INICIALIZA VISUAL ---
init(autoreset=True)

# --- CONFIGURAÇÃO ---
SUPABASE_URL = "https://wgtritvydqrijiziloqy.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndHJpdHZ5ZHFyaWppemlsb3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTMyMjIsImV4cCI6MjA4NTEyOTIyMn0.zT4r43gy0K5hI60ESqYPrstnqkVo1QZ841bpQDvmrLs"
OLLAMA_MODEL = "llama3.1" 
AMAZON_TAG = "timauk27-20" # <--- COLOQUE SUA TAG DE AFILIADO AQUI (Ex: eaclique-20)

# --- FONTES ---
CATEGORIES = {
    "PLANTÃO": ["https://g1.globo.com/rss/g1/mundo/", "https://feeds.bbci.co.uk/portuguese/rss.xml", "https://www.cnnbrasil.com.br/feed/"],
    "ARENA": ["https://ge.globo.com/rss/ge/", "https://www.espn.com.br/espn/rss/news", "https://www.uol.com.br/esporte/rss.xml"],
    "HOLOFOTE": ["https://revistaquem.globo.com/rss/quem/", "https://vogue.globo.com/rss/vogue/gente/", "https://ofuxico.com.br/feed/"],
    "MERCADO": ["https://www.infomoney.com.br/feed/", "https://exame.com/feed/", "https://br.investing.com/rss/news.rss"],
    "PIXEL": ["https://canaltech.com.br/rss/", "https://tecnoblog.net/feed/", "https://olhardigital.com.br/feed/"],
    "PLAY": ["https://br.ign.com/feed.xml", "https://jovemnerd.com.br/feed/"],
    "VITAL": ["https://saude.abril.com.br/feed/", "https://www.minhavida.com.br/rss"],
    "MOTOR": ["https://quatrorodas.abril.com.br/feed/", "https://motor1.uol.com.br/rss/news/all/"],
    "ESTILO": ["https://vogue.globo.com/rss/vogue/moda/", "https://elle.com.br/feed"],
    "VIRAL": ["https://www.buzzfeed.com/br/index.xml"]
}

# --- SETUP SUPABASE ---
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(Fore.RED + f"❌ ERRO CRÍTICO DB: {e}")
    exit()

def log(msg, type="INFO"):
    timestamp = datetime.now().strftime('%H:%M:%S')
    colors = {"INFO": Fore.GREEN, "PROCESS": Fore.CYAN, "SUCCESS": Fore.LIGHTGREEN_EX + Style.BRIGHT, "WARN": Fore.YELLOW, "ERROR": Fore.RED, "SECTION": Fore.MAGENTA + Style.BRIGHT}
    print(f"{colors.get(type, Fore.WHITE)}[{timestamp}] {type} {msg}")

def check_duplicate(link):
    try:
        response = supabase.table("noticias").select("id").eq("fonte_original", link).execute()
        return len(response.data) > 0
    except: return False

def clean_html(html_content):
    try:
        soup = BeautifulSoup(html_content, "html.parser")
        return soup.get_text()
    except: return html_content

def generate_smart_content(title, summary, category):
    print(f"{Fore.GREEN}   └── 🧠 Llama Analisando Vendas & SEO...", end="\r")
    
    # O PULO DO GATO: Pedimos para a IA extrair o "produto_venda" baseada no texto!
    prompt = f"""
    ATUE COMO EDITOR CHEFE E ESPECIALISTA EM E-COMMERCE.
    
    TAREFA: 
    1. Reescreva a notícia para a categoria '{category}'.
    2. Identifique qual PRODUTO FÍSICO da Amazon tem a ver com essa notícia.
       Ex: Se a notícia é sobre "Copa do Mundo", produto="Camisa Seleção Brasil".
       Ex: Se a notícia é sobre "Dólar Alto", produto="Livro Investimentos".
       Ex: Se a notícia é muito abstrata (política), produto="Kindle".
    
    ENTRADA: "{title}" - "{summary}"
    
    SAIDA JSON OBRIGATORIA:
    {{
        "titulo": "Titulo Viral (max 70 chars)",
        "resumo_seo": "Resumo Google (max 150 chars)",
        "produto_venda": "Nome do Produto Amazon (Ex: iPhone 15, Whey Protein, Livro X)",
        "conteudo_html": "<p>Texto jornalístico...</p>"
    }}
    """
    try:
        response = ollama.chat(model=OLLAMA_MODEL, messages=[{'role': 'user', 'content': prompt}], format='json', options={'temperature': 0.7})
        return response['message']['content']
    except Exception as e:
        log(f"Erro Neural: {e}", "ERROR")
        return None

def generate_amazon_link(product_name):
    # Cria um link de BUSCA direta na Amazon. É mais seguro e converte bem.
    # Ex: https://www.amazon.com.br/s?k=iPhone+15&tag=SUATAG
    clean_name = urllib.parse.quote(product_name)
    return f"https://www.amazon.com.br/s?k={clean_name}&tag={AMAZON_TAG}"

def get_image(entry, title):
    try:
        if 'media_content' in entry: return entry.media_content[0]['url']
        if 'links' in entry:
            for link in entry.links:
                if link.type.startswith('image/'): return link.href
        if 'content' in entry:
            soup = BeautifulSoup(entry.content[0].value, 'html.parser')
            img = soup.find('img')
            if img: return img['src']
    except: pass
    
    clean = re.sub(r'[^a-zA-Z0-9 ]', '', title)[:100]
    encoded = urllib.parse.quote(clean)
    return f"https://image.pollinations.ai/prompt/news photo of {encoded}, realistic, 4k?width=800&height=450&model=flux&nologo=true"

def slugify(text):
    text = re.sub(r'[^a-z0-9\s-]', '', text.lower())
    return f"{re.sub(r'\s+', '-', text)}-{int(time.time())}"

def process_feed(category, url):
    log(f"Scanner: {url}", "INFO")
    try:
        feed = feedparser.parse(url)
        if not feed.entries: return 0
        count = 0
        for entry in feed.entries[:2]:
            link = getattr(entry, 'link', f"nolink-{int(time.time())}")
            title = getattr(entry, 'title', 'Sem Titulo')
            
            if check_duplicate(link): continue
            
            log(f"Processando: {title[:30]}...", "PROCESS")
            
            summary = clean_html(getattr(entry, 'summary', '') + " " + getattr(entry, 'description', ''))[:2000]
            ai_res = generate_smart_content(title, summary, category)
            if not ai_res: continue
            
            try:
                data = json.loads(ai_res.replace('```json', '').replace('```', ''))
                new_title = data.get('titulo', title)
                new_html = data.get('conteudo_html', '<p>...</p>')
                new_seo = data.get('resumo_seo', summary[:150])
                
                # A MAGIA ACONTECE AQUI:
                product_keyword = data.get('produto_venda', 'Ofertas do Dia')
                amazon_link = generate_amazon_link(product_keyword)
                
            except: continue

            payload = {
                "slug": slugify(new_title),
                "titulo_viral": new_title,
                "titulo_original": title,
                "conteudo_html": new_html,
                "resumo_seo": new_seo,
                "categoria": category,
                "imagem_capa": get_image(entry, new_title),
                "imagem_alt": new_title,
                "call_to_action_prod": product_keyword,
                "link_afiliado_gerado": amazon_link,
                "created_at": datetime.utcnow().isoformat(),
                "fonte_original": link,
                "views_fake": random.randint(50, 500)
            }

            try:
                supabase.table("Noticias").insert(payload).execute()
                log(f"✅ {new_title[:40]} | Produto: {product_keyword}", "SUCCESS")
                count += 1
            except Exception as e: log(f"DB Error: {e}", "ERROR")
        return count
    except: return 0

def main():
    os.system('cls' if os.name == 'nt' else 'clear')
    print(Fore.GREEN + Style.BRIGHT + r"""
    ____  ____  ____  ____  ____  ____  ____  ____  __   
   (  _ \(  _ \(  _ \(  _ \(  _ \(  _ \(  _ \(  _ \(  )  
    )   / )(_) ))(_) ))(_) ))___/ )(_) ))   / )___/ )(__ 
   (__\_)(____/(____/(____/(__)  (____/(__\_)(__)  (____)
    """)
    print(Fore.GREEN + "    ROBOPORTAL V5.0 - INTELLIGENT SALES AI")
    print(Fore.GREEN + "    MODE: CONTEXTUAL PRODUCT MATCHING")
    print(Fore.GREEN + "    ---------------------------------------")
    time.sleep(2)

    try: requests.get("http://localhost:11434")
    except: 
        log("OLLAMA OFFLINE. Inicie o Ollama primeiro!", "ERROR")
        return

    while True:
        total = 0
        keys = list(CATEGORIES.keys())
        random.shuffle(keys)
        for cat in keys:
            log(f"SCANNING: {cat}", "SECTION")
            urls = CATEGORIES[cat]
            random.shuffle(urls)
            for url in urls:
                total += process_feed(cat, url)
                time.sleep(1)
        
        log(f"CICLO COMPLETO. NOVAS: {total}", "SUCCESS")
        time.sleep(600)

if __name__ == "__main__":
    main()