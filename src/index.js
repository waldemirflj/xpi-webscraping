const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

const fundoDeInvestimento = 'https://institucional.xpi.com.br/investimentos/fundos-de-investimento/lista-de-fundos-de-investimento.aspx';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 768 })
  await page.goto(fundoDeInvestimento);

  // cheerio
  const content = await page.content();
  const $ = cheerio.load(content);
  const data = [];
  
  // cheerio: lista de fundos disponiveis na xp
  $('#tableTodos tbody tr').each((i, element) => {
    const td = $(element).children();
    const nomeDoFundo = td.eq(2).text();
    
    data.push({
      name: nomeDoFundo
    });
  });

  // .json
  fs.writeFile(path.join(__dirname, '../data/data.json'), JSON.stringify(data), (err) => {
    if (err) {
      throw err;
    };
  });

  await browser.close();
})();