require('dotenv').config();
const puppeteer = require('puppeteer');

(async () => {
    console.log("Iniciando Puppeteer...");

    const browser = await puppeteer.launch({ headless: false }); // Modo não-headless para depuração
    const page = await browser.newPage();

    console.log("Acessando a página de login...");
    await page.goto('https://presidentevenceslau.1doc.com.br', { waitUntil: 'networkidle2' });

    console.log("Página carregada!");

    try {
        console.log("Aguardando os campos de login...");
        await page.waitForSelector('input[name="identifier"], #identifier', { timeout: 5000 });
        await page.waitForSelector('input[name="senha"]', { timeout: 5000 });

        console.log("Preenchendo e-mail e senha...");
        await page.type('input[name="identifier"], #identifier', process.env.EMAIL, { delay: 100 });
        await page.type('input[name="senha"]', process.env.SENHA, { delay: 100 });

        console.log("Clicando no botão de login...");
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }), // Aguarda a navegação acontecer
            page.click('button.btn.btn-primary')
        ]);

        console.log("Verificando se o login foi bem-sucedido...");
        const urlAtual = page.url();
        console.log("URL atual:", urlAtual);

        if (urlAtual.includes('painel/listar')) {
            console.log("✅ Login realizado com sucesso!");
        } else {
            console.log("❌ Falha no login. Verifique as credenciais ou possíveis bloqueios.");
            console.log("Página após tentativa de login:");
            console.log(await page.content()); // Exibe o HTML da página para depuração
        }
    } catch (error) {
        console.error("🚨 Erro durante o processo de login:", error);
    } finally {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Aguarda 5s antes de fechar (para visualizar o resultado)
        await browser.close();
    }
})();
