// import TextArea from '../components/TextArea';
// import UsersGrid from '../components/UsersGrid';
// import RouterSwitch from '../components/Router/Switch'
// import Route from '../components/Router/Route'
// import RoutedObject from '../components/Router/RoutedObject';
// // import DraftEditor from '../components/DraftEditor';
// // import TextArea from '../components/TextArea';
// import IconButton from 'material-ui/IconButton'
// import { graphql } from 'react-apollo'
// import gql from 'graphql-tag'
// import ChangeLanguage from '../components/ChangeLanguage';
// import VerticalTimeline from '../components/VerticalTimeline';
// import VerticalTimelineItem from '../components/VerticalTimeline/VerticalTimelineItem';
// import GalleryFiles from '../components/Gallery/GalleryFiles'

import Page from '../components/Page'
import GridComponent from '../components/Grid'
import Connector from '../components/Connectors/Connector'
import ObjectConnector from '../components/Connectors/ObjectConnector'
import ListView from '../components/Connectors/Connector/ListView'
import ObjectView from '../components/Connectors/ObjectConnector/ObjectView'
import Pagination from '../components/Connectors/Connector/Pagination'
import UserLink from '../components/Connectors/Connector/UserLink'
import Filters from '../components/Connectors/Connector/Filters'
import CreatedBy from '../components/Connectors/Connector/Fields/CreatedBy'
import NamedField from '../components/Connectors/Connector/Fields/NamedField'
import Content from '../components/Connectors/Connector/Fields/Content'
import Section from '../components/Section'
import Typography from '../components/Typography'
import PageHeader from '../components/PageHeader'
import Link from '../components/Link'
import Tag from '../components/Tag'
import HtmlTag from '../components/Tag/HtmlTag'
import ObjectImage from '../components/Connectors/Connector/Fields/ObjectImage'
import Button from '../components/Button'
import Query from '../components/Connectors/Query'
import Slider from '../components/Slider'
import Iterable from '../components/Connectors/Connector/ListView/Iterable'
import AppBar from '../components/AppBar'
import Login from '../components/Login'
import LanguageRouter from '../components/LanguageRouter'
import TextField from '../components/form/TextField'
import Switch from '../components/form/Switch'
import EditableObject from '../components/form/EditableObject'
import EditableView from '../components/form/EditableObject/EditableView'
import DefaultView from '../components/form/EditableObject/DefaultView'
import RichText from '../components/RichText'
import Table from '../components/Table'
import TableRow from '../components/Table/TableRow'
import TableCell from '../components/Table/TableCell'
import Tabs from '../components/Tabs'
import Tab from '../components/Tabs/Tab'
import CreateObjectLink from '../components/Button/CreateObjectLink'
import SudoOnly from '../components/SudoOnly'
import EditableObjectButtons from '../components/form/EditableObject/EditableObjectButtons'
import ResetObjectContext from '../components/ResetObjectContext'
import DefaultValue from '../components/Connectors/Connector/Fields/NamedField/DefaultValue'
import CurrentUser from '../components/CurrentUser'
import FileUploader from '../components/FileUploader'
import Select from '../components/form/Select'
import ContentEditor from '../components/ContentEditor'
import ResourceFields from '../components/Resource/Fields'
import { FrontEditorProps } from '../interfaces'

const allComponentsPreset: FrontEditorProps['Components'] = [
  Page,
  GridComponent,
  Section,
  Typography,
  Tag,
  HtmlTag,
  Query,
  Connector,
  ObjectConnector,
  ListView,
  Iterable,
  ObjectView,
  Pagination,
  NamedField,
  DefaultValue,
  EditableObject,
  EditableView,
  DefaultView,
  EditableObjectButtons,
  ResetObjectContext,
  RichText,
  ObjectImage,
  FileUploader,
  UserLink,
  CurrentUser,
  Filters,
  CreateObjectLink,
  SudoOnly,
  CreatedBy,
  ResourceFields,
  Content,
  ContentEditor,
  Link,
  Button,
  PageHeader,
  AppBar,
  Login,
  LanguageRouter,
  Slider,
  TextField,
  Switch,
  Select,
  Table,
  TableRow,
  TableCell,
  Tabs,
  Tab,

  // TODO Restore
  // GalleryFiles,
  // RouterSwitch,
  // Route,
  // VerticalTimeline,
  // VerticalTimelineItem,

  // TODO Rewrite all components to .tsx
] as FrontEditorProps['Components']

export default allComponentsPreset
