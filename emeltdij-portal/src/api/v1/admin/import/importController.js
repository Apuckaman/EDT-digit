const multer = require('multer');

const { ApiError } = require('../../../../errors/ApiError');
const { ImportErrorCodes } = require('./importErrorCodes');
const { runImport } = require('./premiumNumbersImportService');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

function getMode(req) {
  const mode = String(req.query.mode || '').trim();
  if (mode !== 'dry-run' && mode !== 'apply') {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid mode', {
      mode: 'Must be one of: dry-run, apply',
    });
  }
  return mode;
}

const premiumNumbersUploadMiddleware = upload.single('file');

async function importPremiumNumbers(req, res) {
  const mode = getMode(req);

  if (!req.file || !req.file.buffer) {
    throw ApiError.badRequest(
      ImportErrorCodes.MISSING_REQUIRED_FIELD,
      'Missing file',
      { field: 'file' }
    );
  }

  try {
    const result = await runImport({ file: req.file, mode, user: req.user });
    res.json(result);
  } catch (err) {
    if (err && err.code === ImportErrorCodes.CSV_PARSE_ERROR) {
      throw ApiError.badRequest(
        ImportErrorCodes.CSV_PARSE_ERROR,
        'CSV parse error',
        {}
      );
    }
    // For apply mode, per-row errors are returned in response; unexpected errors are 500
    throw err;
  }
}

module.exports = {
  premiumNumbersUploadMiddleware,
  importPremiumNumbers,
};

