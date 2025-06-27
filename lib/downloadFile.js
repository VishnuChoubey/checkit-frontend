// const downloadFile = (content, fileName, mimeType) => {
//   const a = document.createElement('a');
//   const mime = mimeType || 'application/octet-stream';
//   if (navigator.msSaveBlob) {
//     navigator.msSaveBlob(new Blob([content], {
//       type: mime,
//     }), fileName);
//   } else if (URL && 'download' in a) {
//     a.href = URL.createObjectURL(new Blob([content], {
//       type: mime,
//     }));
//     a.setAttribute('download', fileName);
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   } else {
//     // eslint-disable-next-line no-restricted-globals
//     location.href = `data:application/octet-stream,${encodeURIComponent(content)}`;
//   }
// };

const openLink = (url) => {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

export default openLink;