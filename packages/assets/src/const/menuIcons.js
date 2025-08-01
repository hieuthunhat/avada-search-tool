import {SettingsIcon, ShareIcon} from '@shopify/polaris-icons';

const menuIcons = [
  {
    icon: ShareIcon,
    destination: '/samples'
  },
  {
    icon: SettingsIcon,
    destination: '/settings'
  },
  {
    icon: SettingsIcon,
    destination: '/optional-scopes'
  },
  {
    icon: SettingsIcon,
    destination: '/chatting'
  }
];

export const getMenuIcon = url => menuIcons.find(x => x.destination === url)?.icon || SettingsIcon;
