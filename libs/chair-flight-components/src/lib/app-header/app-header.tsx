import { ReactComponent as Logo } from './icon.svg';
import { Link, styled, useColorScheme } from '@mui/joy';
import { useEffect, useState } from 'react';
import { default as LightModeIcon } from '@mui/icons-material/LightMode';
import { default as DarkModeIcon } from '@mui/icons-material/DarkMode';
import { default as IconButton } from '@mui/joy/IconButton';

export const HEADER_HEIGHT = 40;

const StyledHeaderCompanion = styled('div')`
  height: ${HEADER_HEIGHT}px;
  width: 100%;
  content: '';
`;

const StyledHeader = styled('header')`
  color: ${({ theme }) => theme.vars.palette.text.primary};
  width: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${HEADER_HEIGHT}px;
  padding: 0 1rem 0 2rem;
  background-color: ${({ theme }) => theme.vars.palette.neutral.plainHoverBg};
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.shadow.md};

  & > a {
    margin-left: ${({ theme }) => theme.spacing(1)};
    display: flex;
    vertical-align: center;
    align-items: center;
    text-decoration: none;
  }

  & > a > h2 {
    font-size: 14px;
    margin: 0 6px;
    font-weight: 700;
    letter-spacing: 0.05rem;
    color: var(--joy-palette-neutral-plainColor);
  }

  & > a > svg {
    width: 25px;
    height: 25px;
    fill: var(--joy-palette-primary-plainColor);
  }

  &:after {
    content: 'alpha';
    position: absolute;
    width: 80px;
    height: 25px;
    background: #ffc107;
    top: 4px;
    left: -25px;
    z-index: 3000;
    text-align: center;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: bold;
    color: #fff;
    line-height: 27px;
    transform: rotate(-45deg);
  }
`;

const StyledModeButton = styled(IconButton)`
  border: none;
  margin: 0;
  flex: 0;
  padding: 0;
`;

export const AppHeader = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { mode, setMode } = useColorScheme();
  const toggleTheme = () => setMode(mode === 'dark' ? 'light' : 'dark');
  const showDarkModeButton = !isMounted || mode === 'light';

  useEffect(() => setIsMounted(true), []);

  return (
    <>
      <StyledHeader>
        <Link href="/">
          <Logo />
          <h2>CHAIR FLIGHT</h2>
        </Link>
        <StyledModeButton size="sm" variant="outlined" onClick={toggleTheme}>
          {showDarkModeButton ? <LightModeIcon /> : <DarkModeIcon />}
        </StyledModeButton>
      </StyledHeader>
      <StyledHeaderCompanion />
    </>
  );
};
