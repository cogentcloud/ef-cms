export const fileDocumentPrimaryOnChange = ({
  action,
  inputValue,
  updateSequence,
  validateSequence,
}) => {
  switch (action) {
    case 'select-option':
      [
        'category',
        'documentType',
        'documentTitle',
        'eventCode',
        'scenario',
      ].forEach(key =>
        updateSequence({
          key,
          value: inputValue[key],
        }),
      );
      validateSequence();
      break;
    case 'clear':
      updateSequence({
        key: 'category',
        value: '',
      });
      validateSequence();
      break;
  }
};

export const fileDocumentSecondaryOnChange = ({
  action,
  inputValue,
  updateSequence,
  validateSequence,
}) => {
  switch (action) {
    case 'select-option':
      [
        'category',
        'documentType',
        'documentTitle',
        'eventCode',
        'scenario',
      ].forEach(key =>
        updateSequence({
          key: `secondaryDocument.${key}`,
          value: inputValue[key],
        }),
      );
      validateSequence();
      break;
    case 'clear':
      updateSequence({
        key: 'secondaryDocument.category',
        value: '',
      });
      validateSequence();
      break;
  }
};

export const docketEntryOnChange = ({
  action,
  inputValue,
  name,
  updateSequence,
  validateSequence,
}) => {
  switch (action) {
    case 'select-option':
      updateSequence({
        key: name,
        value: inputValue.value,
      });
      validateSequence();
      break;
    case 'clear':
      updateSequence({
        key: name,
        value: '',
      });
      validateSequence();
      break;
  }
  return true;
};

export const courtIssuedDocketEntryOnChange = ({
  action,
  inputValue,
  updateSequence,
  validateSequence,
}) => {
  switch (action) {
    case 'select-option':
      ['documentType', 'documentTitle', 'eventCode', 'scenario'].forEach(key =>
        updateSequence({
          key,
          value: inputValue[key],
        }),
      );
      validateSequence();
      break;
    case 'clear':
      ['documentType', 'documentTitle', 'eventCode', 'scenario'].forEach(key =>
        updateSequence({
          key,
          value: '',
        }),
      );
      validateSequence();
      break;
  }
};

export const onInputChange = ({ action, inputText, updateSequence }) => {
  if (action === 'input-change') {
    updateSequence({
      key: 'searchText',
      value: inputText,
    });
  }
};

export const reactSelectValue = ({ documentTypes, selectedEventCode }) => {
  return documentTypes.filter(option => option.eventCode === selectedEventCode);
};
