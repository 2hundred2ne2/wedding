import styled from '@emotion/styled';
import Copy from '@/assets/icons/copy.svg?react';

interface IAccountProps {
  name: string;
  relation: string;
  bank: string;
  account: string;
  kakaopayAccount?: string;
  tossAccount?: string;
}
const AccountWrap = ({
  name,
  relation,
  bank,
  account,
  kakaopayAccount,
  tossAccount,
}: IAccountProps) => {
  // 화면에는 하이픈(-)이 있는 그대로 보여주고, 복사할 때만 하이픈을 뺍니다.
  const copyText = account.replace(/-/g, '');

  const handleCopy = () => {
    if (!navigator.clipboard) {
      const textarea = document.createElement('textarea');
      textarea.value = copyText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        alert('계좌번호가 복사되었습니다.😉😉');
      } catch {
        alert('계좌번호 복사에 실패했습니다.🥲🥲');
      } finally {
        document.body.removeChild(textarea);
      }
      return;
    }

    navigator.clipboard.writeText(copyText).then(
      () => {
        alert('계좌번호가 복사되었습니다.😉😉');
      },
      () => {
        alert('계좌번호 복사에 실패했습니다.🥲🥲');
      },
    );
  };

  return (
    <Wrapper>
      <Info>
        <Relation>{relation}</Relation>
        <Name>{name}</Name>
      </Info>
      <Details>
        <AccountInfo>
          {bank} {account}
        </AccountInfo>
        <CopyButton onClick={handleCopy}>
          <Copy fill="#222" />
        </CopyButton>
      </Details>
      {(kakaopayAccount || tossAccount) && (
        <AccountLinks>
          {kakaopayAccount && (
            <AccountButton href={kakaopayAccount} target="_blank" rel="noreferrer">
              카카오페이 송금
            </AccountButton>
          )}
          {tossAccount && (
            <AccountButton href={tossAccount} target="_blank" rel="noreferrer">
              토스 송금
            </AccountButton>
          )}
        </AccountLinks>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-family: 'KotraGothic', sans-serif;
  padding: 14px 0;
  border-bottom: 1px solid #eee;
  &:last-of-type {
    padding-bottom: 0;
    border-bottom: none;
  }
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Info = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;
const Relation = styled.span`
  font-size: 0.8rem;
  color: #999;
`;
const Name = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AccountInfo = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dfdfdf;
  border-radius: 6px;
  padding: 4px 6px;
  cursor: pointer;
  outline: none;
  box-shadow: none;
  background: white;
`;

const AccountLinks = styled.div`
  display: flex;
  width: 100%;
  gap: 6px;
  margin-top: 2px;
`;

const AccountButton = styled.button`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  border: 1px solid #dfdfdf;
  border-radius: 8px;
  padding: 6px 0;
  font-size: 0.8rem;
  cursor: pointer;
  color: #44484d;
  text-decoration: none;
  outline: none;
  box-shadow: none;
  background: white;
`.withComponent('a');

export default AccountWrap;
