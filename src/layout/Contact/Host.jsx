import styled from '@emotion/styled';
import React from 'react';
import data from '../../data.json'
import PropTypes from 'prop-types'

const Host = () => {
    const { groom, bride } = data.greeting.host;
  return (
    <>
      <HostContainer>
        <HostInfo person={groom} />
        <HostInfo person={bride} />
      </HostContainer>
    </>
  )
}

export default Host

function HostInfo ( props ) {
    const { person } = props
    return (
        <HostDetails>
            {person.parents && (
            <>
                {person.parents.map((parent, index) => (
                <React.Fragment key={index}>
                    {index > 0 && ' · '}
                    {parent.name}
                </React.Fragment>
                ))}
            </>
            )}
            <RelationText>
            <div>의</div>
            <Relation>{person.relation}</Relation>
            </RelationText>
            <HighlightedName>{person.name}</HighlightedName>
        </HostDetails>
        );
    };

HostInfo.propTypes = {
    person: PropTypes.shape({
        parents:PropTypes.arrayOf(
            PropTypes.shape({
                relation: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
            })
        ),
        relation: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
}
const HighlightedName = styled.span`
    font-weight: 600;
    font-size: 1.1rem;
    color: #4f4f4f;
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