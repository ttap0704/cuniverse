// 애플리케이션에 필요한 Validation 정의

const validations: {
  [key: string]: (target: StringOrNumber) => string;
} = {
  webAddress: (text: StringOrNumber) => {
    const reg = new RegExp(
      /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    );
    if (!reg.test(text)) return "올바른 주소를 입력해주세요.";
    return "";
  },
  nickname: (text: StringOrNumber) => {
    const reg = new RegExp(/^[A-Za-z]{1}[A-Za-z0-9\_]{5,25}$/);
    if (!reg.test(`${text}`))
      return "닉네임은 영어 소/대문자, 숫자, _로 설정해주세요. (5~25자)";
    return "";
  },
  collectionName: (text: StringOrNumber) => {
    const reg = new RegExp(/^[A-Za-z가-힣]{1}[A-Za-z가-힣\s]{5,25}$/);
    if (!reg.test(`${text}`))
      return "컬렉션 이름은 한글, 영어 소/대문자, 숫자로 설정해주세요. (1~25자)";
    return "";
  },
  collectionSymbol: (text: StringOrNumber) => {
    const reg = new RegExp(/^[A-Z]{1,25}$/);
    if (!reg.test(`${text}`))
      return "컬렉션 심볼은 영어 대문자로 설정해주세요. (1~25자)";
    return "";
  },
};

export default validations;
