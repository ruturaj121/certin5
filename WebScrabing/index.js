const { Builder, Browser, By, Key } = require("selenium-webdriver");
const fs = require("fs");
const chrome = require("selenium-webdriver/chrome");
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const sele = require("./index");
const app = express();
const webdriver = require("selenium-webdriver");

const Path = require("chromedriver").path;

const PORT = 4000;

// html setup
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

// body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use('/', todoRouter);
app.get("/", function (req, res) {
  res.sendFile("index.html");
});

app.post("/", function (req, res) {
  const { email, sub, links } = req.body;
  res.send(email, sub, links);
  async function example() {
    var reciverEmail = email.split(","); //"krishna.n@audixindia.in" //"sarthi.shinde@audixindia.in;ruturaj.s@audixindia.in;laukik.t@audixindia.in;krishna.n@audixindia.in;sreedeep.a@audixindia.in;pankaj.g@audixindia.in;amit.a@audixindia.in" // list of receivers;
    const screen = {
      width: 640,
      height: 480,
    };
    // chrome.setDefaultService(new chrome.ServiceBuilder(Path).build());
    let driver =
      // new webdriver.Builder()
      //   .withCapabilities(webdriver.Capabilities.chrome())
      //   .build();
      new Builder()
        .forBrowser("chrome")
        .setChromeOptions(new chrome.Options().headless().windowSize(screen))
        .build();

    //   .setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
    // .build();
    //let driver = await new Builder().forBrowser(Browser.CHROME).build();
    try {
      let output =
        '<!DOCTYPE html><html>  <style>   table {  counter-reset: Serial;  } th,  td { border: 1px solid black; border-collapse: collapse;  text-align: center; }  .auto-index td:first-child:before { counter-increment: Serial; /* Increment the Serial counter */   content: counter(Serial); /* Display the counter */  }  </style>  <body>    <table style="width: 100%">      <tr>        <th colspan="6" style="background-color: red">          Audix Cyber Threat Advisory        </th>      </tr>      <tr style="background-color: rgb(241, 183, 135)">        <td>Sr.No.</td>        <td>Original Issue Date</td>        <td>Cert-in Vulnerability Note</td>        <td>CVE ID</td>        <td>Name of the Vulnerability</td>        <td>Severity</td>      </tr>';

      let link = links.split(",");
      console.log(link);
      let arr = link;

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
          "        </td>    </tr><tr style='background-color: rgb(241, 183, 135)'> <td>Sr.No.</td><td>Original Issue Date</td> <td>Cert-in Vulnerability Note</td><td>CVE ID</td><td>Name of the Vulnerability</td> <td>Severity</td></tr>";
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
          to: reciverEmail,
          subject: sub, //"Audix Cyber Threat Advisory | Sep 2022 ", // Subject line
          //text: "Hello world?", // plain text body
          html: output, // html body
        });
        console.log("Message sent: %s", info.messageId);
      }
      main().catch(console.error);
    } finally {
      await driver.quit();
    }
  }
  example();
});

app.listen(PORT, () => {
  console.log(`app is live at ${PORT}`);
});

// module.exports = { example}
