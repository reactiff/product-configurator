import StringExt from '../../shared/StringExt'
import DateExt from '../../shared/DateExt'
import ArrayExt from '../../shared/ArrayExt'
import {DateUtil} from '../../shared/Util'

///

import MapReduce from '../../shared/MapReduce'
import Inline from '../../shared/Inline'

import Abs from './Abs'
import Accordion from './Accordion'
import ActionButton from './ActionButton'

import BottomNav from './BottomNav'

import Context from './Context'
import CountUpDown from './CountUpDown'

// import Cover from './__Cover'

//import Crud from './Crud'
import CrudAddEntity from './CrudAddEntity'
import CrudEditEntity from './CrudEditEntity'
import CrudList from './CrudList'

import DataTable from './DataTable'
import DemoContainer from './DemoContainer'
import Disclosure from './Disclosure'
import Div from './Div'
import Dropdown from './Dropdown'

import ErrorBoundary from './ErrorBoundary'


import EntityEditor from './EntityEditor'
import EntityPicker from './EntityPicker'
import EntityLink from './EntityLink'
import EntityReference from './EntityReference'

import Flex from './Flex'
import FlexCol from './FlexCol'
import FontAwesomeIcon from './FontAwesomeIcon'
import Form from './Form'

import Image from './Image'
import ImageGallery from './ImageGallery'
import Index from './Index'
import Inspector from './Inspector'

import Lazy from '../Lazy'
import List from './List'
import Logger from './Logger'

import Markdown from './Markdown'
import Masonry from './Masonry'
import MasonryItem from './MasonryItem'
import Modal from './Modal'
import MultiColumnList from './MultiColumnList'

import NameValuePair from './NameValuePair'
import NiftyModal from './NiftyModal'

import Panel from './Panel'
import PeriodSelector from './PeriodSelector'
import Portal from './Portal'
import PortalInspector from './PortalInspector'
import ProfileCard from './ProfileCard'
import ProfileLayout from './ProfileLayout'
import PropertyStrip from './PropertyStrip'
import PropsParser from './modules/PropsParser'

import RadialSpread from './RadialSpread'
import Render from './Render'
import ResponsiveHeader from './ResponsiveHeader'

import SearchBar from './SearchBar'
import Stack from './Stack'
import StarRating from './StarRating'

import Tag from './Tag' // generic tag

import Tabs from './Tabs'
import Thumbnail from './Thumbnail'
import ToDoList from './ToDoList'
import Toggle from './Toggle'
import TypeReference from './TypeReference'



import Upload from './Upload'

// 3rd party libs
import { LoremIpsum } from "lorem-ipsum";

import './css/mpg.css'

const Mpg = {

    Abs: Abs,
    Accordion: Accordion,
    ActionButton: ActionButton,
    
    BottomNav: BottomNav,

    Context: Context,
    CountUpDown: CountUpDown,
    
    // Crud: Crud,
    CrudAddEntity: CrudAddEntity,
    CrudEditEntity: CrudEditEntity,
    CrudList: CrudList,
    
    DataTable: DataTable,
    DemoContainer: DemoContainer,
    Disclosure: Disclosure,
    div: Div,
    Div: Div,
    Dropdown: Dropdown,
    
    EntityEditor: EntityEditor,    
    EntityLink: EntityLink,
    EntityPicker: EntityPicker,
    EntityReference: EntityReference,
    ErrorBoundary: ErrorBoundary,

    Flex: Flex,
    FlexCol: FlexCol,
    FontAwesomeIcon: FontAwesomeIcon,
    Form: Form,
    
    Image: Image,
    ImageGallery: ImageGallery,
    Index: Index,
    Inline: Inline,
    Inspector: Inspector,

    Lazy: Lazy,
    List: List,
    logger: new Logger(),
    LoremIpsum: new LoremIpsum({ sentencesPerParagraph: { max: 8, min: 4 }, wordsPerSentence: { max: 16, min: 4 } }),
   
    
    Markdown: Markdown,
    MapReduce: MapReduce,
    Masonry: Masonry,
    MasonryItem: MasonryItem,
    Modal: Modal,
    MultiColumnList: MultiColumnList,
    
    NameValuePair: NameValuePair,
    NiftyModal: NiftyModal,
    
    Panel: Panel,
    PeriodSelector: PeriodSelector,
    Portal: Portal,
    PortalInspector: PortalInspector,
    ProfileCard: ProfileCard,
    ProfileLayout: ProfileLayout,
    PropertyStrip: PropertyStrip,
    PropsParser: PropsParser,

    RadialSpread: RadialSpread,
    Render: Render,
    ResponsiveHeader: ResponsiveHeader,
    
    SearchBar: SearchBar,
    Stack: Stack,
    StarRating: StarRating,
    
    Tabs: Tabs,
    Tag: Tag,
    Thumbnail: Thumbnail,
    ToDoList: ToDoList,
    Toggle: Toggle,
    TypeReference: TypeReference,

    Upload: Upload,

}

export default Mpg