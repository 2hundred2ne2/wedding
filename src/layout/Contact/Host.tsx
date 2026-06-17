import React from 'react';
import styled from '@emotion/styled';
import data from 'data.json';
import HauntedText from '@/components/HauntedText.tsx';
import { BrideAndGroom } from '@/types/data.ts';

const Host = () => {
  const { groom, bride } = data.greeting.host;
  return (
    <>
      <HostContainer>
        <HostInfo person={groom} />
        <HostInfo person={bride} />
      </HostContainer>
    </>
  );
};

export default Host;

const HostInfo = ({ person }: { person: BrideAndGroom }) => {
  return (
    <HostDetails>
      {person.parents && (
        <>
          {person.parents.map((parent, index) => (
            <React.Fragment key={index}>
              {index > 0 && <HauntedText text=" · " inline />}
              <HauntedText text={parent.name} inline />
            </React.Fragment>
          ))}
        </>
      )}
      <RelationText>
        <div><HauntedText text="의" inline /></div>
        <Relation><HauntedText text={person.relation} inline /></Relation>
      </RelationText>
      <HighlightedName><HauntedText text={person.name} inline /></HighlightedName>
    </HostDetails>
  );
};

const HighlightedName = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  color: #222;
  margin-right: 5px;
`;

const HostContainer = styled.div`
  gap: 8px;
  font-family: HSSanTokki20-Regular, serif;
`;

const HostDetails = styled.div`
  padding: 0 55px;
  justify-content: center;
  white-space: nowrap;
  display: flex;
  gap: 6px;
  text-align: center;
  align-items: center;
  font-weight: 700;
`;

const RelationText = styled.div`
  font-style: normal;
  line-height: 26px;
  width: 50px;
  display: flex;
  gap: 6px;
`;

const Relation = styled.div`
  width: inherit;
`;
