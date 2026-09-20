import styled from '@emotion/styled';
import AccountWrap from './AccountWrap.tsx';
import { useAccounts } from './useAccounts.ts';
import Accordion from '@/components/Accordion.tsx';

const Account = () => {
  const { hosts, status } = useAccounts();

  if (status === 'loading') {
    return <Message>계좌 정보를 불러오는 중이에요.</Message>;
  }

  if (status === 'error') {
    return <Message>계좌 정보를 잠시 불러올 수 없어요. 잠시 후 다시 시도해주세요.</Message>;
  }

  return (
    <HostInfoWrapper>
      {hosts.map((host) => {
        return (
          <Accordion title={host.host} key={host.host}>
            {host.accountInfo.map((account) => {
              return (
                <AccountWrap
                  key={account.name}
                  name={account.name}
                  relation={account.relation}
                  bank={account.bank}
                  account={account.account}
                  kakaopayAccount={account.kakaopayAccount}
                  tossAccount={account.tossAccount}
                />
              );
            })}
          </Accordion>
        );
      })}
    </HostInfoWrapper>
  );
};

export default Account;

const Message = styled.p`
  text-align: center;
  font-weight: 200;
  padding: 20px 0;
`;

const HostInfoWrapper = styled.div`
  display: flex;
  width: 90%;
  flex-direction: column;
  padding: 20px;
`;
