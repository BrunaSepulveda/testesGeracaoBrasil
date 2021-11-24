const puppeteer = require("puppeteer");
const download = require("download");
const xlsx = require("node-xlsx");

async function siga() {
  const browser = await puppeteer.launch();
  // pagina Principal
  const page = await browser.newPage();
  await page.goto(
    "https://app.powerbi.com/view?r=eyJrIjoiNjc4OGYyYjQtYWM2ZC00YjllLWJlYmEtYzdkNTQ1MTc1NjM2IiwidCI6IjQwZDZmOWI4LWVjYTctNDZhMi05MmQ0LWVhNGU5YzAxNzBlMSIsImMiOjR9"
  );
  await page.waitForTimeout(1000 * 25);
  const link = await page.$eval("a.textRun", (el) => el.href);

  // Pagina DRO
  await page.goto(
    "https://app.powerbi.com/view?r=eyJrIjoiNjc4OGYyYjQtYWM2ZC00YjllLWJlYmEtYzdkNTQ1MTc1NjM2IiwidCI6IjQwZDZmOWI4LWVjYTctNDZhMi05MmQ0LWVhNGU5YzAxNzBlMSIsImMiOjR9&pageName=ReportSection9bf4dc10205ada909c69"
  );
  await page.waitForTimeout(1000 * 25);
  const linkDRO = await page.$eval("a.textRun", (el) => el.href);

  await browser.close();

  try {
    // Download
    const planilha = await download(link);
    const planilhaDRO = await download(linkDRO);

    // Parse
    const planilhaObj = xlsx.parse(planilha)
    const planilhaObjDRO = xlsx.parse(planilhaDRO);
    
    console.log(planilhaObj[0].data[1])
    console.log(planilhaObjDRO[0].data[1])
  } catch (error) {
    console.error(error);
  }
  // const planilhaDRO = await download(linkDRO)
}

siga();
