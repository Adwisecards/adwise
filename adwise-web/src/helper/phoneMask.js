const phoneMask = (phone) => {
  let lenPhone = phone.length;
  let tt = phone.split('');
  if (lenPhone == 11) {
    tt.splice(1, '', ' ');
    tt.splice(5, '', ' ');
    tt.splice(9, '', '-');
    tt.splice(12, '', '-');
  } else if (lenPhone == 12) {
    tt.splice(2, '', ' ');
    tt.splice(6, '', ' ');
    tt.splice(10, '', '-');
    tt.splice(13, '', '-');
  }
  return tt.join('');
};

export { phoneMask };
