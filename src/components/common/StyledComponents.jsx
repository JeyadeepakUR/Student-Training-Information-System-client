import styled from 'styled-components';
import { commonStyles } from '../../theme';

export const Card = styled.div`
  ${commonStyles.card}
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const Button = styled.button`
  ${commonStyles.button}
  background-color: ${props => props.variant === 'primary' ? props.theme.colors.primary.main : 'transparent'};
  color: ${props => props.variant === 'primary' ? 'white' : props.theme.colors.text.primary};
  border: ${props => props.variant === 'outline' ? `1px solid ${props.theme.colors.border.medium}` : 'none'};
  
  &:hover {
    background-color: ${props => props.variant === 'primary' ? props.theme.colors.primary.dark : props.theme.colors.background.light};
  }
`;

export const Input = styled.input`
  ${commonStyles.input}
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

export const Select = styled.select`
  ${commonStyles.input}
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

export const Table = styled.table`
  ${commonStyles.table}
`;

export const TableHead = styled.thead``;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr``;

export const TableCell = styled.td``;

export const TableHeaderCell = styled.th``;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 1}, 1fr);
  gap: ${props => props.gap || props.theme.spacing.md};
`;

export const Flex = styled.div`
  display: flex;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || props.theme.spacing.md};
`;

export const Typography = styled.div`
  font-size: ${props => props.variant ? props.theme.typography[props.variant].fontSize : props.theme.typography.body.fontSize};
  font-weight: ${props => props.variant ? props.theme.typography[props.variant].fontWeight : props.theme.typography.body.fontWeight};
  color: ${props => props.color ? props.theme.colors.text[props.color] : props.theme.colors.text.primary};
  margin: ${props => props.margin || 0};
`; 