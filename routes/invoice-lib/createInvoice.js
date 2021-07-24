const fs = require("fs");
const PDFDocument = require("pdfkit");
let mainThres = 50;
let hrThres = 45;

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc, invoice);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);
  invoice.paid ? generateStatus(doc, invoice) : {};

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(10)
    .text(invoice.sender.name, 200, 50, { align: "right" })
    .text(invoice.sender.address, 200, 65, { align: "right" })
    .text(invoice.sender.state, 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text(invoice.name, 50, 140);
  doc.fillColor("#444444").fontSize(14).text(invoice.summary, 50, 160);

  generateHr(doc, 165);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(
      invoice.invoice_nr ? invoice.invoice_nr : "",
      150,
      customerInformationTop
    )
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(invoice.date, 150, customerInformationTop + 15)
    .text("Invoice Due:", 50, customerInformationTop + 30)
    .text(invoice.due, 150, customerInformationTop + 30)

    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.address, 300, customerInformationTop + 15)
    .text(
      invoice.shipping.city !== "" ||
        invoice.shipping.state !== "" ||
        invoice.shipping.country !== ""
        ? (invoice.shipping.city +
            ", " +
            invoice.shipping.state +
            ", " +
            invoice.shipping.country,
          300,
          customerInformationTop + 30)
        : ""
    )
    .moveDown();

  generateHr(doc, 232);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  const discountAmount =
    (parseInt(invoice.discount) / 100) * parseInt(invoice.subtotal);

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Rate/Item",
    "Quantity",
    "Amount"
  );
  generateHr(doc, invoiceTableTop);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.price),
      item.quantity,
      formatCurrency(parseInt(item.price) * parseInt(item.quantity))
    );

    generateHr(doc, position);
  }

  const subtotalPosition = invoiceTableTop + (i + 2) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal.toFixed(2))
  );

  let disPosition = subtotalPosition;
  if (invoice.discount) {
    disPosition += 20;
    generateTableRow(
      doc,
      disPosition,
      "",
      "",
      `Discount (${invoice.discount}%)`,
      "",
      `- ${formatCurrency(discountAmount.toFixed(2))}`
    );
  }

  const taxPosition = disPosition + 20;
  let measurePos = disPosition;
  if (invoice.taxObj) {
    measurePos = disPosition + 20;
    for (let j = 0; j < Object.keys(invoice.taxObj).length; j++) {
      measurePos = taxPosition + j * 20;
      generateTableRow(
        doc,
        taxPosition + j * 20,
        "",
        "",
        `${Object.keys(invoice.taxObj)[j]}(${
          Object.values(invoice.taxObj)[j]
        }%)`,
        "",
        formatCurrency(
          (
            (parseInt(Object.values(invoice.taxObj)[j]) / 100) *
            (parseInt(invoice.subtotal) - discountAmount)
          ).toFixed(2)
        )
      );
    }
  }

  const duePosition = measurePos + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Payment Due",
    "",
    formatCurrency(invoice.total)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc.fontSize(10).text("Thank you for your business.", 50, 780, {
    align: "center",
    width: 500,
  });
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  if (y > 680) {
    if (mainThres === 50) {
      doc.addPage();
    }
    if (mainThres > 680) {
      doc.addPage();
      mainThres = 50;
    }
    y = mainThres;
    mainThres += 20;
  }

  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateStatus(doc, invoice) {
  doc
    .fillColor("#ff0033", 0.6)
    .fontSize(50)
    .text("Paid", 50, 380, { align: "center", width: 500 });
}

function generateHr(doc, y) {
  if (y > 680) {
    if (hrThres > 680) {
      hrThres = 45;
    }
    y = hrThres + 20;
    hrThres += 20;
  } else {
    y += 20;
  }
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
  return "Rs. " + cents;
}

module.exports = createInvoice;
