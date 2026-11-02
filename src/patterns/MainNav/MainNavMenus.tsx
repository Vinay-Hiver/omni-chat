import type { ReactNode } from 'react'
import { Icon } from '../../icons/Icon'
import type { IconName } from '../../icons/iconData'

export type MenuEntry = { id: string; label: string; icon: IconName; /** Shows a right arrow. */ arrow?: boolean }

/** The entries under "Your availability" in the avatar menu. */
export const userMenuEntries: MenuEntry[] = [
  { id: 'team-availability', label: 'Team Availability', icon: 'teamavailability', arrow: true },
  { id: 'admin-panel', label: 'Admin Panel', icon: 'settings', arrow: true },
  { id: 'my-settings', label: 'My Settings', icon: 'mysetting', arrow: true },
  { id: 'switch-account', label: 'Switch Account', icon: 'switchaccountavailability', arrow: true },
  { id: 'logout', label: 'Logout', icon: 'logout' },
]

/** The entries in the Help Center menu. */
export const helpMenuEntries: MenuEntry[] = [
  { id: 'restart-onboarding', label: 'Restart Onboarding Walkthrough', icon: 'refresh', arrow: true },
  { id: 'help-articles', label: 'Help Articles', icon: 'book', arrow: true },
  { id: 'product-roadmap', label: 'Product Roadmap', icon: 'unkown1', arrow: true },
  { id: 'mobile-app', label: 'Get Mobile App', icon: 'clipbord', arrow: true },
  { id: 'feature-request', label: 'Submit Feature Request', icon: 'massage', arrow: true },
]

export type UserMenuProps = {
  name: string
  email: string
  /** The line under "Your availability", for example "Available on Chat, Email and Voice". */
  availability: string
  onSelect?: (id: string) => void
}

function Row({ entry, onSelect }: { entry: MenuEntry; onSelect?: (id: string) => void }) {
  return (
    <button type="button" role="menuitem" className="hot-menu__row" onClick={() => onSelect?.(entry.id)}>
      <span className="hot-menu__icon"><Icon name={entry.icon} size={16} /></span>
      <span className="hot-menu__label">{entry.label}</span>
      {entry.arrow && <span className="hot-menu__arrow"><Icon name="chevronright" size={16} /></span>}
    </button>
  )
}

/** The Hiver Omni logo, drawn as in Figma. It is a picture, so it is not a component. */
function OmniLogo() {
  return (
    <svg className="hot-menu__logo" width={107} height={27} viewBox="0 0 107 27" fill="none" role="img" aria-label="Hiver Omni">
      <g fill="var(--slateTextCaption)">
        <path d="M105.34 18.5484V10.6826H106.904V18.5484H105.34ZM105.229 9.32637V7.42773H107V9.32637H105.229Z" />
        <path d="M96.5376 18.5485V10.6827H98.1171V12.3899L97.7981 12.4856C97.9363 12.0495 98.1331 11.6932 98.3884 11.4167C98.6543 11.1294 98.9628 10.9114 99.3137 10.7625C99.6754 10.6136 100.064 10.5391 100.479 10.5391C101.351 10.5391 102.031 10.7944 102.521 11.3049C103.021 11.8048 103.271 12.5388 103.271 13.5067V18.5485H101.707V14.0811C101.707 13.3259 101.569 12.7728 101.292 12.4218C101.027 12.0707 100.612 11.8953 100.048 11.8953C99.6219 11.8953 99.2662 11.991 98.9788 12.1825C98.7022 12.3739 98.4894 12.6771 98.3405 13.0919C98.1916 13.5067 98.1171 14.0332 98.1171 14.6714V18.5485H96.5376Z" />
        <path d="M83.2473 18.5485V10.6827H84.8269V12.709L84.4918 12.8206C84.5876 12.4058 84.7205 12.0548 84.8907 11.7677C85.0609 11.4805 85.2576 11.2465 85.481 11.0656C85.7151 10.8848 85.965 10.7519 86.2309 10.6668C86.4969 10.5817 86.7681 10.5391 87.0446 10.5391C87.502 10.5391 87.9115 10.6295 88.2731 10.8103C88.6455 10.9805 88.9539 11.2518 89.1985 11.624C89.4538 11.9856 89.624 12.4644 89.7091 13.06L88.8156 13.2355C88.9752 12.6185 89.1826 12.1133 89.4379 11.7197C89.7038 11.3262 90.0229 11.0337 90.3951 10.8422C90.778 10.6401 91.2142 10.5391 91.7035 10.5391C92.3629 10.5391 92.8894 10.6881 93.283 10.9859C93.6871 11.2837 93.9797 11.6719 94.1605 12.1506C94.3519 12.6185 94.4477 13.1344 94.4477 13.6982V18.5485H92.9001V14.0811C92.9001 13.6237 92.8469 13.2355 92.7405 12.9164C92.6342 12.5866 92.4693 12.3367 92.2459 12.1666C92.0226 11.9856 91.7247 11.8953 91.3525 11.8953C90.9908 11.8953 90.6823 11.991 90.427 12.1825C90.1718 12.3633 89.975 12.6398 89.8367 13.0121C89.7091 13.3844 89.6453 13.8471 89.6453 14.4002V18.5485H88.0817V13.9854C88.0817 13.2833 87.9488 12.7622 87.6829 12.4218C87.4276 12.0707 87.0552 11.8953 86.566 11.8953C86.2043 11.8953 85.8905 11.991 85.6246 12.1825C85.3694 12.3633 85.1725 12.6398 85.0343 13.0121C84.896 13.3844 84.8269 13.8471 84.8269 14.4002V18.5485H83.2473Z" />
        <path d="M76.1625 18.7562C75.1307 18.7562 74.2213 18.5168 73.4342 18.0382C72.6577 17.5595 72.0514 16.8894 71.6154 16.0279C71.1792 15.1556 70.9612 14.1452 70.9612 12.9964C70.9612 11.837 71.1792 10.8265 71.6154 9.96496C72.0514 9.09276 72.6577 8.41733 73.4342 7.93868C74.2213 7.46004 75.1307 7.2207 76.1625 7.2207C77.2155 7.2207 78.1356 7.46004 78.9227 7.93868C79.7098 8.41733 80.3214 9.09276 80.7575 9.96496C81.1937 10.8265 81.4117 11.837 81.4117 12.9964C81.4117 14.1452 81.1883 15.1556 80.7416 16.0279C80.3055 16.8894 79.6939 17.5595 78.9067 18.0382C78.1197 18.5168 77.2049 18.7562 76.1625 18.7562ZM76.1625 17.2086C76.907 17.2086 77.5453 17.0383 78.0771 16.6979C78.6089 16.3469 79.0237 15.8577 79.3215 15.2301C79.6194 14.5919 79.7683 13.8474 79.7683 12.9964C79.7683 12.1349 79.6194 11.3902 79.3215 10.7627C79.0237 10.1246 78.6089 9.63523 78.0771 9.29485C77.5453 8.94384 76.907 8.76834 76.1625 8.76834C75.4392 8.76834 74.8063 8.93853 74.2638 9.2789C73.732 9.61927 73.3172 10.1085 73.0193 10.7467C72.7321 11.3743 72.5886 12.1242 72.5886 12.9964C72.5886 13.858 72.7321 14.6079 73.0193 15.2461C73.3172 15.8736 73.732 16.3576 74.2638 16.6979C74.8063 17.0383 75.4392 17.2086 76.1625 17.2086Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M9.94535 0.654125C11.1616 -0.0513756 12.6627 -0.0513746 13.8789 0.654126L21.8712 5.29003C23.0801 5.99127 23.8242 7.28315 23.8242 8.68074V17.9842C23.8242 19.3818 23.0801 20.6738 21.8712 21.375L13.8789 26.0109C12.6627 26.7164 11.1616 26.7164 9.94535 26.0109L1.95307 21.375C0.744127 20.6738 0 19.3818 0 17.9842V8.68074C0 7.28314 0.744128 5.99127 1.95307 5.29003L9.94535 0.654125Z" />
        <path d="M56.3535 18.6869V10.5766H58.4099V12.781L58.0973 12.8139C58.1302 12.3423 58.2728 11.9256 58.525 11.5636C58.7773 11.2017 59.0844 10.922 59.4463 10.7246C59.8192 10.5162 60.1976 10.4121 60.5814 10.4121C60.8556 10.4121 61.1133 10.4505 61.3546 10.5272C61.6069 10.593 61.8646 10.7081 62.1279 10.8727L61.1408 12.7152C61.0201 12.6494 60.8665 12.5891 60.6802 12.5343C60.4937 12.4794 60.3073 12.4519 60.1208 12.4519C59.9015 12.4519 59.6876 12.4904 59.4792 12.5672C59.2818 12.644 59.1008 12.7645 58.9364 12.9291C58.7828 13.0935 58.6567 13.3129 58.558 13.5871C58.5141 13.7406 58.4757 13.9381 58.4428 14.1793C58.4209 14.4096 58.4099 14.7496 58.4099 15.1993V18.6869H56.3535Z" />
        <path d="M51.9856 18.8513C51.2836 18.8513 50.6805 18.7362 50.176 18.5059C49.6715 18.2756 49.2547 17.9685 48.9257 17.5847C48.6076 17.1899 48.3718 16.7456 48.2183 16.2521C48.0647 15.7476 47.988 15.2212 47.988 14.6729C47.988 14.1464 48.0647 13.6309 48.2183 13.1264C48.3718 12.622 48.6022 12.1668 48.9092 11.761C49.2164 11.3553 49.6112 11.0317 50.0938 10.7905C50.5872 10.5382 51.174 10.4121 51.854 10.4121C52.4901 10.4121 53.0439 10.5217 53.5155 10.741C53.9871 10.9495 54.3764 11.2456 54.6836 11.6294C54.9906 12.0023 55.2209 12.441 55.3745 12.9455C55.539 13.45 55.6212 13.9874 55.6212 14.5577C55.6212 14.6344 55.6158 14.7441 55.6048 14.8867C55.6048 15.0184 55.5939 15.1609 55.5719 15.3144H50.0279C50.0828 15.8957 50.2967 16.3344 50.6695 16.6305C51.0534 16.9266 51.5304 17.0746 52.1007 17.0746C52.5175 17.0746 52.9233 17.0034 53.3181 16.8608C53.7129 16.7073 54.0639 16.4934 54.371 16.2192L55.391 17.6011C55.007 17.8973 54.6451 18.1385 54.3052 18.325C53.9652 18.5114 53.6087 18.643 53.2359 18.7198C52.874 18.8075 52.4572 18.8513 51.9856 18.8513ZM53.5978 14.2945C53.6197 14.2067 53.6361 14.119 53.6471 14.0313C53.669 13.9435 53.68 13.8613 53.68 13.7845C53.68 13.5541 53.6362 13.3403 53.5484 13.1429C53.4607 12.9345 53.34 12.7535 53.1865 12.6001C53.033 12.4465 52.8465 12.3314 52.6272 12.2546C52.4188 12.1668 52.1775 12.1229 51.9033 12.1229C51.4975 12.1229 51.1575 12.2053 50.8834 12.3697C50.6091 12.5343 50.4008 12.7481 50.2582 13.0113C50.1267 13.2636 50.0444 13.5268 50.0114 13.8009H54.2888L53.5978 14.2945Z" />
        <path d="M43.3323 18.6884L40.0093 10.5781H42.2466L44.1548 16.0234L46.0961 10.5781H48.3005L45.0103 18.6884H43.3323Z" />
        <path d="M37.631 18.687V10.5767H39.6709V18.687H37.631ZM37.5652 9.32642V7.2207H39.7531V9.32642H37.5652Z" />
        <path d="M29.2756 18.687V7.2207H31.3319V12.4192L30.9864 12.4685C31.129 11.9751 31.3375 11.5802 31.6116 11.2841C31.8967 10.977 32.2203 10.7576 32.5822 10.6261C32.9551 10.4835 33.328 10.4122 33.7009 10.4122C34.6222 10.4122 35.3405 10.6754 35.8559 11.2018C36.3824 11.7173 36.6456 12.4467 36.6456 13.3898V18.687H34.5893V14.1466C34.5893 13.4666 34.4686 12.973 34.2274 12.666C33.986 12.3479 33.6076 12.1889 33.0922 12.1889C32.5109 12.1889 32.0722 12.3973 31.7762 12.814C31.48 13.2308 31.3319 13.8943 31.3319 14.8046V18.687H29.2756Z" />
      </g>
      <path d="M8.18408 7.73242C9.92311 7.73242 11.3328 9.14215 11.3328 10.8812V19.9699C9.59382 19.9699 8.18408 18.5602 8.18408 16.8212V7.73242Z" fill="var(--slateSurfaceWhite)" />
      <path d="M12.907 13.3105C14.6459 13.3105 16.0557 14.7203 16.0557 16.4592V20.3034C14.3167 20.3034 12.907 18.8937 12.907 17.1546V13.3105Z" fill="var(--slateSurfaceWhite)" />
      <path d="M66.1602 0.125V26.4582" stroke="var(--slateBorderDefault)" strokeWidth={0.171269} />
    </svg>
  )
}

/** The menu that opens from the avatar at the bottom of the Main nav. */
export function UserMenu({ name, email, availability, onSelect }: UserMenuProps): ReactNode {
  return (
    <div className="hot-menu hot-menu--user" role="menu" aria-label="Account">
      <div className="hot-menu__header">
        <div className="hot-menu__name">{name}</div>
        <div className="hot-menu__email">{email}</div>
      </div>
      <div className="hot-menu__rows">
        <button type="button" role="menuitem" className="hot-menu__row hot-menu__row--availability" onClick={() => onSelect?.('availability')}>
          <span className="hot-menu__icon"><Icon name="assigned" size={16} /></span>
          <span className="hot-menu__text">
            <span className="hot-menu__title">Your availability</span>
            <span className="hot-menu__sub">{availability}</span>
          </span>
          <span className="hot-menu__arrow"><Icon name="chevrondown" size={16} /></span>
        </button>
        {userMenuEntries.map((e) => <Row key={e.id} entry={e} onSelect={onSelect} />)}
      </div>
      <div className="hot-menu__footer"><OmniLogo /></div>
    </div>
  )
}

/** The menu that opens from Help Center in the Main nav. */
export function HelpMenu({ onSelect }: { onSelect?: (id: string) => void }): ReactNode {
  return (
    <div className="hot-menu hot-menu--help" role="menu" aria-label="Help Center">
      <div className="hot-menu__title-bar">Help Center</div>
      <div className="hot-menu__rows hot-menu__rows--help">
        {helpMenuEntries.map((e) => <Row key={e.id} entry={e} onSelect={onSelect} />)}
      </div>
    </div>
  )
}
