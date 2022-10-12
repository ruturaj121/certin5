const { Builder, Browser, By, Key } = require("selenium-webdriver");
const fs = require("fs");
const chrome = require("selenium-webdriver/chrome");
const nodemailer = require("nodemailer");

(async function example() {
  const screen = {
    width: 640,
    height: 480,
  };

  let driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options().headless().windowSize(screen))
    //   .setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
    .build();
  //let driver = await new Builder().forBrowser(Browser.CHROME).build();
  try {
    let output =
      '<!DOCTYPE html><html>  <style>   table {  counter-reset: Serial;  } th,  td { border: 1px solid black; border-collapse: collapse;  text-align: center; }  .auto-index td:first-child:before { counter-increment: Serial; /* Increment the Serial counter */   content: counter(Serial); /* Display the counter */  }  </style>  <body>    <table style="width: 100%">      <tr>        <th colspan="6" style="background-color: red">          Audix Cyber Threat Advisory        </th>      </tr>      <tr style="background-color: rgb(241, 183, 135)">        <td>Sr.No.</td>        <td>Original Issue Date</td>        <td>Cert-in Vulnerability Note</td>        <td>CVE ID</td>        <td>Name of the Vulnerability</td>        <td>Severity</td>      </tr>';

    let arr = [
      "https://www.cert-in.org.in/s2cMainServlet?pageid=PUBVLNOTES01&VLCODE=CIVN-2022-0383",
      "https://www.cert-in.org.in/s2cMainServlet?pageid=PUBVLNOTES01&VLCODE=CIVN-2022-0382",
      "https://www.cert-in.org.in/s2cMainServlet?pageid=PUBVLNOTES01&VLCODE=CIVN-2022-0381",
    ];

    let data = [];
    for (let array of arr) {
      // console.log(array);
      await driver.get(array);

      //**********************Cert-in Vulnerability Note******************************* */
      let head = await driver
        .findElement(By.xpath('//*[@id="Source"]/tr[2]/td/span[1]'))
        .getText();
      let checkHead = head.trim().split(/\s+/);

      //*********************Name of the  Vulnerability******************************* */

      let name = await driver
        .findElement(By.xpath('//*[@id="Source"]/tr[2]/td/span[2]'))
        .getText();

      //**********************Original Issue Date******************************* */
      let date = await driver
        .findElement(By.xpath('//*[@id="Source"]/tr[2]/td/p[1]'))
        .getText();
      let checkDate = date.trim().split(":");
      let checkdate1 = checkDate[1].split(/\n/);

      //**********************Severity******************************* */
      let rating = await driver
        .findElement(By.xpath('//*[@id="Source"]/tr[2]/td/p[1]/span'))
        .getText();
      let checkRating = rating.trim().split(":");
      //**********************Software Affected And Version******************************* */
      let affect = "";
      for (j = 1; j < 50; j++) {
        try {
          let affected = await driver
            .findElement(
              By.xpath(`//*[@id="Source"]/tr[2]/td/span[3]/ul/li[` + j + `]`)
            )
            .getText();

          // let final =
          //   '<a href="' + cveName + '">' + checkCvvName[1] + "</a></br>";
          let checkAffected = "<ul><li>" + affected + "</li></ul>";
          affect += checkAffected;
        } catch (error) {
          break;
        }
      }
      //let checkAffected = "<ul><li>" + affected + "</li></br></ul>";

      //**********************Description******************************* */
      let description1 = await driver
        .findElement(By.xpath('//*[@id="Source"]/tr[2]/td/span[5]'))
        .getText();
      let description2 = await driver
        .findElement(By.xpath('//*[@id="Source"]/tr[2]/td/span[6]'))
        .getText();

      let description =
        "<ul><li>" + description1 + "</li> <li> " + description2 + "</li>";

      //**********************Recomendation******************************* */
      // if (solution) {
      let recomnedation = await driver
        .findElement(By.xpath('//*[@id="Source"]/tr[2]/td/span[7]'))
        .getText();
      //console.log(recomnedation);
      //}

      //**********************CVE Name******************************* */
      //async function cveLinks() {
      let cveName1 = "";
      for (i = 1; i < 500; i++) {
        try {
          let link = await driver.findElement(
            By.xpath(`//*[@id="Source"]/tr[2]/td/p[10]/a[` + i + `]`)
          );

          let cveName = await link.getAttribute("href");
          let checkCvvName = cveName.trim().split("=");
          let final =
            '<p><a href="' + cveName + '">' + checkCvvName[1] + "</a></p>";
          cveName1 += final;
          //console.log(checkCvvName[1]);
          //console.log(await link.getAttribute("href"));
        } catch (error) {
          break;
        }
      }
      output =
        output +
        '<tr class="auto-index"><td rowspan="4" style="background-color: rgb(241, 183, 135)"></td>        <td>      <b>    ' +
        checkdate1[0].replace(/,/g, " ") +
        "       </b> </td>        <td>        <a href='" +
        array +
        "'>" +
        checkHead[3] +
        "</a>  </td>        <td>         " +
        cveName1 +
        "        </td>        <td>         " +
        name +
        '</td>        <td style="color: red">          ' +
        checkRating[1] +
        '        </td>      </tr>      <tr>        <td style="background-color: rgb(241, 183, 135)">          Software Affected And Version        </td>        <td colspan="4"style="text-align: left">       ' +
        affect +
        '   </td>      </tr>      <tr>        <td style="background-color: rgb(241, 183, 135)">Description</td>        <td colspan="4"style="text-align: left">         ' +
        description +
        '        </td>      </tr>      <tr>        <td style="background-color: rgb(241, 183, 135)">Recomendation</td>        <td colspan="4">          ' +
        recomnedation +
        "        </td>    </tr><tr style='background-color: rgb(255, 207, 130)'> <td>Sr.No.</td><td>Original Issue Date</td> <td>Cert-in Vulnerability Note</td><td>CVE ID</td><td>Name of the Vulnerability</td> <td>Severity</td></tr>";
    }
    output = output + "</table>  </body></html>";
    // console.log(output);

    async function main() {
      let testAccount = await nodemailer.createTestAccount();
      let transporter = nodemailer.createTransport({
        host: "sysmic.icewarpcloud.in",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "ruturaj.s@audixindia.in", // generated ethereal user
          pass: "Ruturajwork@123", // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: "ruturaj.s@audixindia.in", // sender address
        to: "laukik.t@audixindia.in", // "sarthi.shinde@audixindia.in;ruturaj.s@audixindia.in;laukik.t@audixindia.in;krishna.n@audixindia.in;sreedeep.a@audixindia.in;pankaj.g@audixindia.in;amit.a@audixindia.in", // list of receivers
        subject: "Audix Cyber Threat Advisory | Sep 2022 ", // Subject line
        //text: "Hello world?", // plain text body
        html: output, // html body
      });
      console.log("Message sent: %s", info.messageId);
    }
    main().catch(console.error);
  } finally {
    await driver.quit();
  }
})();
