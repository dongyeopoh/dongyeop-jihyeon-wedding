import data from '../../data.json'
import styled from '@emotion/styled';
import { Caption, Paragraph } from '../../components/Text';
import Host from '../Contact/Host';
import { Google } from '@mui/icons-material';
import { Button } from '@mui/material';


const InvitationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
`;

const Invitation = () => {
    const { greeting } = data;
    return (
        <InvitationWrapper>
            <Paragraph>{greeting.message}</Paragraph>
            <Host />
            <Caption textAlign={'center'}>{greeting.eventDetail}</Caption>

            <Button sx={{bgcolor:'#69aca0bc', 
                    color:'lightcyan', 
                    borderRadius: '20px',
                    fontWeight:'bold'}} 
                    variant='contained' 
                    startIcon={<Google />}  
                    href="https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=Nmxvdmw5czJ2bjVsM3E2bjllcG1lNTZjM2YgYjkxOGI0OTIwNTc3MWU4MGY1YWExMThmNjJlMjhlOThkNjlkM2Q0MzQ3NDMzMzU1NzBiNjM1NjcxNWRhNGE1NEBn&tmsrc=b918b49205771e80f5aa118f62e28e98d69d3d434743335570b6356715da4a54%40group.calendar.google.com"
                    rel="noreferrer"
                    target='_blank'
                    >
                        구글캘린더 일정 추가하기
                    </Button>                
        </InvitationWrapper>

    );
}

export default Invitation