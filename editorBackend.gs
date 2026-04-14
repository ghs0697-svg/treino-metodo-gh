/**
 * Backend do Editor - Metodo GH
 *
 * COMO USAR:
 * 1. Abra script.google.com e crie um novo projeto
 * 2. Cole este codigo inteiro
 * 3. Implemente > Nova Implantacao > App da Web
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 * 4. Copie a URL e cole no painel do treinador no site
 */

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;

    if (action === 'write') {
      return writeToSheet(payload.sheetId, payload.tab, payload.data);
    }

    return jsonResponse({ error: 'Acao desconhecida: ' + action });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function writeToSheet(sheetId, tabName, data) {
  if (!sheetId || !tabName || !data || !data.length) {
    return jsonResponse({ error: 'Dados incompletos' });
  }

  var ss = SpreadsheetApp.openById(sheetId);
  var sh = ss.getSheetByName(tabName);

  if (!sh) {
    sh = ss.insertSheet(tabName);
  } else {
    sh.clear();
    sh.clearFormats();
  }

  // Ensure all rows have 4 columns
  var rows = data.map(function(r) {
    while (r.length < 4) r.push('');
    return r.slice(0, 4);
  });

  sh.getRange(1, 1, rows.length, 4).setValues(rows);

  // Delete extra columns if they exist
  if (sh.getMaxColumns() > 4) {
    sh.deleteColumns(5, sh.getMaxColumns() - 4);
  }

  // Apply formatting
  formatDietaAtual_(sh, rows.length);

  return jsonResponse({ ok: true, rows: rows.length });
}

function formatDietaAtual_(sh, last) {
  var cols = 4;

  // Column widths
  sh.setColumnWidth(1, 65);
  sh.setColumnWidth(2, 280);
  sh.setColumnWidth(3, 130);
  sh.setColumnWidth(4, 400);

  // Header
  var hdr = sh.getRange(1, 1, 1, cols);
  hdr.setBackground('#D4AF37').setFontColor('#0D0D0D').setFontWeight('bold').setFontSize(10);
  hdr.setHorizontalAlignment('center').setFontFamily('Arial');
  sh.setFrozenRows(1);
  sh.setRowHeight(1, 28);

  // Global defaults
  var all = sh.getRange(2, 1, last - 1, cols);
  all.setFontFamily('Arial').setFontSize(10).setVerticalAlignment('middle');
  all.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  all.setBackground('#FFFFFF').setFontColor('#333333').setFontWeight('normal').setFontStyle('normal');

  var data = sh.getRange(2, 1, last - 1, cols).getValues();

  for (var i = 0; i < data.length; i++) {
    var row = i + 2;
    var tipo = String(data[i][0]).toLowerCase().trim();
    var r = sh.getRange(row, 1, 1, cols);
    var temConteudo = String(data[i][1]).trim() !== '';

    // Column A: small gray
    sh.getRange(row, 1).setFontSize(8).setFontColor('#AAAAAA');

    if (tipo === 'info' || tipo === 'aluno') {
      r.setBackground('#FFF8E7').setFontWeight('bold');
      sh.getRange(row, 1).setFontColor('#C8A030');
      sh.getRange(row, 2).setFontColor('#5D4037').setFontSize(12);
      sh.getRange(row, 3).setFontColor('#1565C0').setFontSize(11);
      sh.getRange(row, 4).setFontColor('#5D4037');
      sh.setRowHeight(row, 32);
    }
    else if (tipo === 'meta') {
      r.setBackground('#FFFDF5');
      sh.getRange(row, 2).setFontWeight('bold').setFontColor('#795548');
      sh.getRange(row, 3).setFontColor('#1565C0');
      sh.setRowHeight(row, 24);
    }
    else if (tipo === 'regra') {
      r.setBackground('#FFFFFF');
      sh.getRange(row, 2).setFontWeight('bold').setFontColor('#333333');
      sh.getRange(row, 3).setFontColor('#1565C0');
      sh.getRange(row, 4).setFontColor('#666666').setFontStyle('italic');
      sh.setRowHeight(row, 24);
    }
    else if (tipo === 'supl') {
      r.setBackground('#F5FFF5');
      sh.getRange(row, 2).setFontWeight('bold').setFontColor('#2E7D32');
      sh.getRange(row, 3).setFontColor('#1565C0');
      sh.getRange(row, 4).setFontColor('#666666').setFontStyle('italic');
      sh.setRowHeight(row, 24);
    }
    else if (tipo === 'ref') {
      r.setBackground('#5D4037').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(11);
      sh.getRange(row, 1).setFontColor('#D4AF37').setFontSize(9);
      sh.setRowHeight(row, 34);
    }
    else if (tipo === 'op') {
      r.setBackground('#FFF3CD').setFontWeight('bold');
      sh.getRange(row, 2).setFontColor('#5D4037');
      sh.getRange(row, 1).setFontColor('#C8A030');
      sh.setRowHeight(row, 28);
    }
    else if (tipo === 'obs' || tipo === 'nota') {
      r.setFontStyle('italic').setFontColor('#888888').setFontSize(9);
      r.setBackground('#F8F8F8');
      sh.setRowHeight(row, 22);
    }
    else if (tipo === 'dica' || tipo === 'orient') {
      r.setBackground('#F0F5FF');
      sh.getRange(row, 2).setFontWeight('bold').setFontColor('#5D4037');
      sh.getRange(row, 4).setFontColor('#666666');
      sh.setRowHeight(row, 24);
    }
    else if (tipo === 'cardio' || tipo === 'aerob') {
      r.setBackground('#F0FFF0');
      sh.getRange(row, 2).setFontWeight('bold').setFontColor('#2E7D32');
      sh.getRange(row, 3).setFontColor('#1565C0');
      sh.getRange(row, 4).setFontColor('#666666');
      sh.setRowHeight(row, 24);
    }
    else if (tipo === 'proto') {
      r.setBackground('#FFF0F5');
      sh.getRange(row, 2).setFontWeight('bold').setFontColor('#880E4F');
      sh.getRange(row, 3).setFontColor('#1565C0');
      sh.getRange(row, 4).setFontColor('#666666');
      sh.setRowHeight(row, 24);
    }
    else if (tipo === 'ciclo') {
      r.setBackground('#8B7425').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(12);
      sh.setRowHeight(row, 34);
    }
    else if (tipo === '' && temConteudo) {
      r.setBackground('#FFFFFF');
      sh.getRange(row, 2).setFontWeight('bold').setFontColor('#333333');
      sh.getRange(row, 3).setFontColor('#1565C0');
      sh.getRange(row, 4).setFontColor('#666666').setFontStyle('italic');
      sh.setRowHeight(row, 24);
    }
    else if (tipo === '' && !temConteudo) {
      r.setBackground('#F0EDE5');
      sh.setRowHeight(row, 6);
    }
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function
function testDoPost() {
  var e = {
    postData: {
      contents: JSON.stringify({
        action: 'write',
        sheetId: 'YOUR_TEST_SHEET_ID',
        tab: 'DIETA ATUAL',
        data: [
          ['SECAO','ITEM','QUANTIDADE','OBSERVACAO'],
          ['info','Teste','2.000 kcal','Teste do Editor'],
          ['meta','Hidratacao','3 litros/dia','']
        ]
      })
    }
  };
  var result = doPost(e);
  Logger.log(result.getContent());
}
