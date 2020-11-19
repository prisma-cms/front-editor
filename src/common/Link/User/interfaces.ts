import { TypographyProps } from 'material-ui/Typography'
import { UiLinkProps } from '../interfaces'

type User = any

export enum UikitUserLinkAvatarSize {
  small = 'small',
  normal = 'normal',
}

export type UikitUserLinkObject = {
  __typename?: User['__typename']
  id?: User['id']
  username?: User['username']
  fullname?: User['fullname']
}

export interface UikitUserLinkProps {
  user?: UikitUserLinkObject | null | undefined

  variant?: TypographyProps['variant']

  withAvatar?: boolean

  classes?: UiLinkProps['classes'] & { avatar: string }

  /**
   * Дополнительный контент
   */
  secondary?: any

  showName?: boolean

  size?: UikitUserLinkAvatarSize

  avatarProps?: any

  // TODO: заменить на какую-то универсальную сущность типа secondaryText
  /**
   * Должность или позиция в команде
   */
  position?: any

  onClick?: (event?: any) => void

  className?: string
}
