/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Achievement = {
  __typename?: 'Achievement';
  adjustedPlayersCompletedPercent?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  hidden: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  normalizedRarity?: Maybe<Scalars['String']['output']>;
  normalizedSide?: Maybe<Scalars['String']['output']>;
  playersCompletedPercent: Scalars['Float']['output'];
  rarity?: Maybe<Scalars['String']['output']>;
  side?: Maybe<Scalars['String']['output']>;
};

export type Ammo = {
  __typename?: 'Ammo';
  /** @deprecated Use accuracyModifier instead. */
  accuracy?: Maybe<Scalars['Int']['output']>;
  accuracyModifier?: Maybe<Scalars['Float']['output']>;
  ammoType: Scalars['String']['output'];
  armorDamage: Scalars['Int']['output'];
  caliber?: Maybe<Scalars['String']['output']>;
  damage: Scalars['Int']['output'];
  fragmentationChance: Scalars['Float']['output'];
  heavyBleedModifier: Scalars['Float']['output'];
  initialSpeed?: Maybe<Scalars['Float']['output']>;
  item: Item;
  lightBleedModifier: Scalars['Float']['output'];
  penetrationChance: Scalars['Float']['output'];
  penetrationPower: Scalars['Int']['output'];
  penetrationPowerDeviation?: Maybe<Scalars['Float']['output']>;
  projectileCount?: Maybe<Scalars['Int']['output']>;
  /** @deprecated Use recoilModifier instead. */
  recoil?: Maybe<Scalars['Int']['output']>;
  recoilModifier?: Maybe<Scalars['Float']['output']>;
  ricochetChance: Scalars['Float']['output'];
  stackMaxSize: Scalars['Int']['output'];
  staminaBurnPerDamage?: Maybe<Scalars['Float']['output']>;
  tracer: Scalars['Boolean']['output'];
  tracerColor?: Maybe<Scalars['String']['output']>;
  weight: Scalars['Float']['output'];
};

export type ArmorMaterial = {
  __typename?: 'ArmorMaterial';
  destructibility?: Maybe<Scalars['Float']['output']>;
  explosionDestructibility?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  maxRepairDegradation?: Maybe<Scalars['Float']['output']>;
  maxRepairKitDegradation?: Maybe<Scalars['Float']['output']>;
  minRepairDegradation?: Maybe<Scalars['Float']['output']>;
  minRepairKitDegradation?: Maybe<Scalars['Float']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type AttributeThreshold = {
  __typename?: 'AttributeThreshold';
  name: Scalars['String']['output'];
  requirement: NumberCompare;
};

export type Barter = {
  __typename?: 'Barter';
  buyLimit?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  level: Scalars['Int']['output'];
  requiredItems: Array<Maybe<ContainedItem>>;
  /** @deprecated Use level instead. */
  requirements: Array<Maybe<PriceRequirement>>;
  rewardItems: Array<Maybe<ContainedItem>>;
  /** @deprecated Use trader and level instead. */
  source: Scalars['String']['output'];
  /** @deprecated Use trader instead. */
  sourceName: ItemSourceName;
  taskUnlock?: Maybe<Task>;
  trader: Trader;
};

export type BossEscort = {
  __typename?: 'BossEscort';
  amount?: Maybe<Array<Maybe<BossEscortAmount>>>;
  boss: MobInfo;
  /** @deprecated Use boss.name instead. */
  name: Scalars['String']['output'];
  /** @deprecated Use boss.normalizedName instead. */
  normalizedName: Scalars['String']['output'];
};

export type BossEscortAmount = {
  __typename?: 'BossEscortAmount';
  chance: Scalars['Float']['output'];
  count: Scalars['Int']['output'];
};

export type BossSpawn = {
  __typename?: 'BossSpawn';
  boss: MobInfo;
  escorts: Array<Maybe<BossEscort>>;
  /** @deprecated Use boss.name instead. */
  name: Scalars['String']['output'];
  /** @deprecated Use boss.normalizedName instead. */
  normalizedName: Scalars['String']['output'];
  spawnChance: Scalars['Float']['output'];
  spawnLocations: Array<Maybe<BossSpawnLocation>>;
  spawnTime?: Maybe<Scalars['Int']['output']>;
  spawnTimeRandom?: Maybe<Scalars['Boolean']['output']>;
  spawnTrigger?: Maybe<Scalars['String']['output']>;
  switch?: Maybe<MapSwitch>;
};

/**
 * The chances of spawning in a given location are
 * very rough estimates and may be incaccurate
 */
export type BossSpawnLocation = {
  __typename?: 'BossSpawnLocation';
  chance: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  spawnKey: Scalars['String']['output'];
};

export type ContainedItem = {
  __typename?: 'ContainedItem';
  attributes?: Maybe<Array<Maybe<ItemAttribute>>>;
  count: Scalars['Float']['output'];
  item: Item;
  quantity: Scalars['Float']['output'];
};

export type Craft = {
  __typename?: 'Craft';
  duration: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  level: Scalars['Int']['output'];
  requiredItems: Array<Maybe<ContainedItem>>;
  requiredQuestItems: Array<Maybe<QuestItem>>;
  /** @deprecated Use stationLevel instead. */
  requirements: Array<Maybe<PriceRequirement>>;
  rewardItems: Array<Maybe<ContainedItem>>;
  /** @deprecated Use stationLevel instead. */
  source: Scalars['String']['output'];
  /** @deprecated Use stationLevel instead. */
  sourceName: Scalars['String']['output'];
  station: HideoutStation;
  taskUnlock?: Maybe<Task>;
};

export type FleaMarket = Vendor & {
  __typename?: 'FleaMarket';
  enabled: Scalars['Boolean']['output'];
  foundInRaidRequired?: Maybe<Scalars['Boolean']['output']>;
  minPlayerLevel: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  normalizedName: Scalars['String']['output'];
  reputationLevels: Array<Maybe<FleaMarketReputationLevel>>;
  sellOfferFeeRate: Scalars['Float']['output'];
  sellRequirementFeeRate: Scalars['Float']['output'];
};

export type FleaMarketReputationLevel = {
  __typename?: 'FleaMarketReputationLevel';
  maxRep: Scalars['Float']['output'];
  minRep: Scalars['Float']['output'];
  offers: Scalars['Int']['output'];
  offersSpecialEditions: Scalars['Int']['output'];
};

export enum GameMode {
  Pve = 'pve',
  Regular = 'regular'
}

export type GameProperty = {
  __typename?: 'GameProperty';
  arrayValue?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  key: Scalars['String']['output'];
  numericValue?: Maybe<Scalars['Float']['output']>;
  objectValue?: Maybe<Scalars['String']['output']>;
  stringValue?: Maybe<Scalars['String']['output']>;
};

export type GoonReport = {
  __typename?: 'GoonReport';
  map?: Maybe<Map>;
  timestamp?: Maybe<Scalars['String']['output']>;
};

export enum HandbookCategoryName {
  Ammo = 'Ammo',
  AmmoPacks = 'AmmoPacks',
  AssaultCarbines = 'AssaultCarbines',
  AssaultRifles = 'AssaultRifles',
  AssaultScopes = 'AssaultScopes',
  AuxiliaryParts = 'AuxiliaryParts',
  Backpacks = 'Backpacks',
  Barrels = 'Barrels',
  BarterItems = 'BarterItems',
  Bipods = 'Bipods',
  BodyArmor = 'BodyArmor',
  BoltActionRifles = 'BoltActionRifles',
  BuildingMaterials = 'BuildingMaterials',
  ChargingHandles = 'ChargingHandles',
  Collimators = 'Collimators',
  CompactCollimators = 'CompactCollimators',
  Drinks = 'Drinks',
  ElectronicKeys = 'ElectronicKeys',
  Electronics = 'Electronics',
  EnergyElements = 'EnergyElements',
  Eyewear = 'Eyewear',
  Facecovers = 'Facecovers',
  FlammableMaterials = 'FlammableMaterials',
  FlashhidersBrakes = 'FlashhidersBrakes',
  Flashlights = 'Flashlights',
  Food = 'Food',
  Foregrips = 'Foregrips',
  FunctionalMods = 'FunctionalMods',
  GasBlocks = 'GasBlocks',
  Gear = 'Gear',
  GearComponents = 'GearComponents',
  GearMods = 'GearMods',
  GrenadeLaunchers = 'GrenadeLaunchers',
  Handguards = 'Handguards',
  Headgear = 'Headgear',
  Headsets = 'Headsets',
  HouseholdMaterials = 'HouseholdMaterials',
  InfoItems = 'InfoItems',
  Injectors = 'Injectors',
  InjuryTreatment = 'InjuryTreatment',
  IronSights = 'IronSights',
  Keys = 'Keys',
  LaserTargetPointers = 'LaserTargetPointers',
  Launchers = 'Launchers',
  LightLaserDevices = 'LightLaserDevices',
  MachineGuns = 'MachineGuns',
  Magazines = 'Magazines',
  Maps = 'Maps',
  MarksmanRifles = 'MarksmanRifles',
  MechanicalKeys = 'MechanicalKeys',
  MedicalSupplies = 'MedicalSupplies',
  Medication = 'Medication',
  Medkits = 'Medkits',
  MeleeWeapons = 'MeleeWeapons',
  Money = 'Money',
  Mounts = 'Mounts',
  MuzzleAdapters = 'MuzzleAdapters',
  MuzzleDevices = 'MuzzleDevices',
  Optics = 'Optics',
  Others = 'Others',
  Pills = 'Pills',
  PistolGrips = 'PistolGrips',
  Pistols = 'Pistols',
  Provisions = 'Provisions',
  QuestItems = 'QuestItems',
  ReceiversSlides = 'ReceiversSlides',
  Rounds = 'Rounds',
  SmGs = 'SMGs',
  SecureContainers = 'SecureContainers',
  Shotguns = 'Shotguns',
  Sights = 'Sights',
  SpecialEquipment = 'SpecialEquipment',
  SpecialPurposeSights = 'SpecialPurposeSights',
  SpecialWeapons = 'SpecialWeapons',
  StocksChassis = 'StocksChassis',
  StorageContainers = 'StorageContainers',
  Suppressors = 'Suppressors',
  TacticalComboDevices = 'TacticalComboDevices',
  TacticalRigs = 'TacticalRigs',
  Throwables = 'Throwables',
  Tools = 'Tools',
  Valuables = 'Valuables',
  VitalParts = 'VitalParts',
  WeaponPartsMods = 'WeaponPartsMods',
  Weapons = 'Weapons'
}

export type HealthEffect = {
  __typename?: 'HealthEffect';
  bodyParts: Array<Maybe<Scalars['String']['output']>>;
  effects: Array<Maybe<Scalars['String']['output']>>;
  time?: Maybe<NumberCompare>;
};

export type HealthPart = {
  __typename?: 'HealthPart';
  bodyPart: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  max: Scalars['Int']['output'];
};

/** HideoutModule has been replaced with HideoutStation. */
export type HideoutModule = {
  __typename?: 'HideoutModule';
  /** @deprecated Use HideoutStation type instead. */
  id?: Maybe<Scalars['Int']['output']>;
  itemRequirements: Array<Maybe<ContainedItem>>;
  level?: Maybe<Scalars['Int']['output']>;
  moduleRequirements: Array<Maybe<HideoutModule>>;
  /** @deprecated Use HideoutStation type instead. */
  name?: Maybe<Scalars['String']['output']>;
};

export type HideoutStation = {
  __typename?: 'HideoutStation';
  /** crafts is only available via the hideoutStations query. */
  crafts: Array<Maybe<Craft>>;
  id: Scalars['ID']['output'];
  imageLink?: Maybe<Scalars['String']['output']>;
  levels: Array<Maybe<HideoutStationLevel>>;
  name: Scalars['String']['output'];
  normalizedName: Scalars['String']['output'];
  tarkovDataId?: Maybe<Scalars['Int']['output']>;
};

export type HideoutStationBonus = {
  __typename?: 'HideoutStationBonus';
  name: Scalars['String']['output'];
  passive?: Maybe<Scalars['Boolean']['output']>;
  production?: Maybe<Scalars['Boolean']['output']>;
  skillName?: Maybe<Scalars['String']['output']>;
  slotItems?: Maybe<Array<Maybe<Item>>>;
  type: Scalars['String']['output'];
  value?: Maybe<Scalars['Float']['output']>;
};

export type HideoutStationLevel = {
  __typename?: 'HideoutStationLevel';
  bonuses?: Maybe<Array<Maybe<HideoutStationBonus>>>;
  constructionTime: Scalars['Int']['output'];
  /** crafts is only available via the hideoutStations query. */
  crafts: Array<Maybe<Craft>>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  itemRequirements: Array<Maybe<RequirementItem>>;
  level: Scalars['Int']['output'];
  skillRequirements: Array<Maybe<RequirementSkill>>;
  stationLevelRequirements: Array<Maybe<RequirementHideoutStationLevel>>;
  tarkovDataId?: Maybe<Scalars['Int']['output']>;
  traderRequirements: Array<Maybe<RequirementTrader>>;
};

export type Item = {
  __typename?: 'Item';
  accuracyModifier?: Maybe<Scalars['Float']['output']>;
  avg24hPrice?: Maybe<Scalars['Int']['output']>;
  backgroundColor: Scalars['String']['output'];
  bartersFor: Array<Maybe<Barter>>;
  bartersUsing: Array<Maybe<Barter>>;
  baseImageLink?: Maybe<Scalars['String']['output']>;
  basePrice: Scalars['Int']['output'];
  blocksHeadphones?: Maybe<Scalars['Boolean']['output']>;
  /** @deprecated Use category instead. */
  bsgCategory?: Maybe<ItemCategory>;
  bsgCategoryId?: Maybe<Scalars['String']['output']>;
  buyFor?: Maybe<Array<ItemPrice>>;
  categories: Array<Maybe<ItemCategory>>;
  category?: Maybe<ItemCategory>;
  /** @deprecated No longer meaningful with inclusion of Item category. */
  categoryTop?: Maybe<ItemCategory>;
  changeLast48h?: Maybe<Scalars['Float']['output']>;
  changeLast48hPercent?: Maybe<Scalars['Float']['output']>;
  conflictingItems?: Maybe<Array<Maybe<Item>>>;
  conflictingSlotIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  containsItems?: Maybe<Array<Maybe<ContainedItem>>>;
  craftsFor: Array<Maybe<Craft>>;
  craftsUsing: Array<Maybe<Craft>>;
  description?: Maybe<Scalars['String']['output']>;
  ergonomicsModifier?: Maybe<Scalars['Float']['output']>;
  fleaMarketFee?: Maybe<Scalars['Int']['output']>;
  gridImageLink?: Maybe<Scalars['String']['output']>;
  /** @deprecated Fallback handled automatically by gridImageLink. */
  gridImageLinkFallback: Scalars['String']['output'];
  handbookCategories: Array<Maybe<ItemCategory>>;
  hasGrid?: Maybe<Scalars['Boolean']['output']>;
  height: Scalars['Int']['output'];
  high24hPrice?: Maybe<Scalars['Int']['output']>;
  /** historicalPrices is only available via the item and items queries. */
  historicalPrices?: Maybe<Array<Maybe<HistoricalPricePoint>>>;
  iconLink?: Maybe<Scalars['String']['output']>;
  /** @deprecated Fallback handled automatically by iconLink. */
  iconLinkFallback: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image8xLink?: Maybe<Scalars['String']['output']>;
  image512pxLink?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use inspectImageLink instead. */
  imageLink?: Maybe<Scalars['String']['output']>;
  /** @deprecated Fallback handled automatically by inspectImageLink. */
  imageLinkFallback: Scalars['String']['output'];
  inspectImageLink?: Maybe<Scalars['String']['output']>;
  lastLowPrice?: Maybe<Scalars['Int']['output']>;
  lastOfferCount?: Maybe<Scalars['Int']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  loudness?: Maybe<Scalars['Int']['output']>;
  low24hPrice?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  normalizedName?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<ItemProperties>;
  receivedFromTasks: Array<Maybe<Task>>;
  recoilModifier?: Maybe<Scalars['Float']['output']>;
  sellFor?: Maybe<Array<ItemPrice>>;
  shortName?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use sellFor instead. */
  traderPrices: Array<Maybe<TraderPrice>>;
  /** @deprecated Use the lang argument on queries instead. */
  translation?: Maybe<ItemTranslation>;
  types: Array<Maybe<ItemType>>;
  updated?: Maybe<Scalars['String']['output']>;
  usedInTasks: Array<Maybe<Task>>;
  velocity?: Maybe<Scalars['Float']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
  width: Scalars['Int']['output'];
  wikiLink?: Maybe<Scalars['String']['output']>;
};


export type ItemFleaMarketFeeArgs = {
  count?: InputMaybe<Scalars['Int']['input']>;
  hideoutManagementLevel?: InputMaybe<Scalars['Int']['input']>;
  intelCenterLevel?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  requireAll?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ItemTranslationArgs = {
  languageCode?: InputMaybe<LanguageCode>;
};

export type ItemArmorSlot = {
  nameId?: Maybe<Scalars['String']['output']>;
  zones?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ItemArmorSlotLocked = ItemArmorSlot & {
  __typename?: 'ItemArmorSlotLocked';
  armorType?: Maybe<Scalars['String']['output']>;
  baseValue?: Maybe<Scalars['Int']['output']>;
  bluntThroughput?: Maybe<Scalars['Float']['output']>;
  class?: Maybe<Scalars['Int']['output']>;
  durability?: Maybe<Scalars['Int']['output']>;
  ergoPenalty?: Maybe<Scalars['Float']['output']>;
  material?: Maybe<ArmorMaterial>;
  name?: Maybe<Scalars['String']['output']>;
  nameId?: Maybe<Scalars['String']['output']>;
  repairCost?: Maybe<Scalars['Int']['output']>;
  speedPenalty?: Maybe<Scalars['Float']['output']>;
  turnPenalty?: Maybe<Scalars['Float']['output']>;
  zones?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ItemArmorSlotOpen = ItemArmorSlot & {
  __typename?: 'ItemArmorSlotOpen';
  allowedPlates?: Maybe<Array<Maybe<Item>>>;
  name?: Maybe<Scalars['String']['output']>;
  nameId?: Maybe<Scalars['String']['output']>;
  zones?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ItemAttribute = {
  __typename?: 'ItemAttribute';
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type ItemCategory = {
  __typename?: 'ItemCategory';
  children?: Maybe<Array<Maybe<ItemCategory>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  normalizedName: Scalars['String']['output'];
  parent?: Maybe<ItemCategory>;
};

export enum ItemCategoryName {
  Ammo = 'Ammo',
  AmmoContainer = 'AmmoContainer',
  ArmBand = 'ArmBand',
  Armor = 'Armor',
  ArmorPlate = 'ArmorPlate',
  ArmoredEquipment = 'ArmoredEquipment',
  AssaultCarbine = 'AssaultCarbine',
  AssaultRifle = 'AssaultRifle',
  AssaultScope = 'AssaultScope',
  AuxiliaryMod = 'AuxiliaryMod',
  Backpack = 'Backpack',
  Barrel = 'Barrel',
  BarterItem = 'BarterItem',
  Battery = 'Battery',
  Bipod = 'Bipod',
  BuildingMaterial = 'BuildingMaterial',
  ChargingHandle = 'ChargingHandle',
  ChestRig = 'ChestRig',
  CombMuzzleDevice = 'CombMuzzleDevice',
  CombTactDevice = 'CombTactDevice',
  CommonContainer = 'CommonContainer',
  CompactReflexSight = 'CompactReflexSight',
  Compass = 'Compass',
  CompoundItem = 'CompoundItem',
  CultistAmulet = 'CultistAmulet',
  CylinderMagazine = 'CylinderMagazine',
  Drink = 'Drink',
  Drug = 'Drug',
  Electronics = 'Electronics',
  Equipment = 'Equipment',
  EssentialMod = 'EssentialMod',
  FaceCover = 'FaceCover',
  Flashhider = 'Flashhider',
  Flashlight = 'Flashlight',
  Food = 'Food',
  FoodAndDrink = 'FoodAndDrink',
  Foregrip = 'Foregrip',
  Fuel = 'Fuel',
  FunctionalMod = 'FunctionalMod',
  GasBlock = 'GasBlock',
  GearMod = 'GearMod',
  GrenadeLauncher = 'GrenadeLauncher',
  Handguard = 'Handguard',
  Handgun = 'Handgun',
  Headphones = 'Headphones',
  Headwear = 'Headwear',
  HouseholdGoods = 'HouseholdGoods',
  Info = 'Info',
  Ironsight = 'Ironsight',
  Item = 'Item',
  Jewelry = 'Jewelry',
  Key = 'Key',
  Keycard = 'Keycard',
  Knife = 'Knife',
  LockingContainer = 'LockingContainer',
  Lubricant = 'Lubricant',
  Machinegun = 'Machinegun',
  Magazine = 'Magazine',
  Map = 'Map',
  MarksmanRifle = 'MarksmanRifle',
  MechanicalKey = 'MechanicalKey',
  MedicalItem = 'MedicalItem',
  MedicalSupplies = 'MedicalSupplies',
  Medikit = 'Medikit',
  Meds = 'Meds',
  Money = 'Money',
  Mount = 'Mount',
  MuzzleDevice = 'MuzzleDevice',
  NightVision = 'NightVision',
  Other = 'Other',
  PistolGrip = 'PistolGrip',
  PortContainer = 'PortContainer',
  PortableRangeFinder = 'PortableRangeFinder',
  RadioTransmitter = 'RadioTransmitter',
  RandomLootContainer = 'RandomLootContainer',
  Receiver = 'Receiver',
  ReflexSight = 'ReflexSight',
  RepairKits = 'RepairKits',
  Revolver = 'Revolver',
  Smg = 'SMG',
  Scope = 'Scope',
  SearchableItem = 'SearchableItem',
  Shotgun = 'Shotgun',
  Sights = 'Sights',
  Silencer = 'Silencer',
  SniperRifle = 'SniperRifle',
  SpecialItem = 'SpecialItem',
  SpecialScope = 'SpecialScope',
  SpringDrivenCylinder = 'SpringDrivenCylinder',
  StackableItem = 'StackableItem',
  Stimulant = 'Stimulant',
  Stock = 'Stock',
  ThermalVision = 'ThermalVision',
  ThrowableWeapon = 'ThrowableWeapon',
  Tool = 'Tool',
  Ubgl = 'UBGL',
  VisObservDevice = 'VisObservDevice',
  Weapon = 'Weapon',
  WeaponMod = 'WeaponMod'
}

export type ItemFilters = {
  __typename?: 'ItemFilters';
  allowedCategories: Array<Maybe<ItemCategory>>;
  allowedItems: Array<Maybe<Item>>;
  excludedCategories: Array<Maybe<ItemCategory>>;
  excludedItems: Array<Maybe<Item>>;
};

export type ItemPrice = {
  __typename?: 'ItemPrice';
  currency?: Maybe<Scalars['String']['output']>;
  currencyItem?: Maybe<Item>;
  price?: Maybe<Scalars['Int']['output']>;
  priceRUB?: Maybe<Scalars['Int']['output']>;
  /** @deprecated Use vendor instead. */
  requirements: Array<Maybe<PriceRequirement>>;
  /** @deprecated Use vendor instead. */
  source?: Maybe<ItemSourceName>;
  vendor: Vendor;
};

export type ItemProperties = ItemPropertiesAmmo | ItemPropertiesArmor | ItemPropertiesArmorAttachment | ItemPropertiesBackpack | ItemPropertiesBarrel | ItemPropertiesChestRig | ItemPropertiesContainer | ItemPropertiesFoodDrink | ItemPropertiesGlasses | ItemPropertiesGrenade | ItemPropertiesHeadphone | ItemPropertiesHeadwear | ItemPropertiesHelmet | ItemPropertiesKey | ItemPropertiesMagazine | ItemPropertiesMedKit | ItemPropertiesMedicalItem | ItemPropertiesMelee | ItemPropertiesNightVision | ItemPropertiesPainkiller | ItemPropertiesPreset | ItemPropertiesResource | ItemPropertiesScope | ItemPropertiesStim | ItemPropertiesSurgicalKit | ItemPropertiesWeapon | ItemPropertiesWeaponMod;

export type ItemPropertiesAmmo = {
  __typename?: 'ItemPropertiesAmmo';
  /** @deprecated Use accuracyModifier instead. */
  accuracy?: Maybe<Scalars['Int']['output']>;
  accuracyModifier?: Maybe<Scalars['Float']['output']>;
  ammoType?: Maybe<Scalars['String']['output']>;
  armorDamage?: Maybe<Scalars['Int']['output']>;
  ballisticCoeficient?: Maybe<Scalars['Float']['output']>;
  bulletDiameterMilimeters?: Maybe<Scalars['Float']['output']>;
  bulletMassGrams?: Maybe<Scalars['Float']['output']>;
  caliber?: Maybe<Scalars['String']['output']>;
  damage?: Maybe<Scalars['Int']['output']>;
  durabilityBurnFactor?: Maybe<Scalars['Float']['output']>;
  failureToFeedChance?: Maybe<Scalars['Float']['output']>;
  fragmentationChance?: Maybe<Scalars['Float']['output']>;
  heatFactor?: Maybe<Scalars['Float']['output']>;
  heavyBleedModifier?: Maybe<Scalars['Float']['output']>;
  initialSpeed?: Maybe<Scalars['Float']['output']>;
  lightBleedModifier?: Maybe<Scalars['Float']['output']>;
  misfireChance?: Maybe<Scalars['Float']['output']>;
  penetrationChance?: Maybe<Scalars['Float']['output']>;
  penetrationPower?: Maybe<Scalars['Int']['output']>;
  penetrationPowerDeviation?: Maybe<Scalars['Float']['output']>;
  projectileCount?: Maybe<Scalars['Int']['output']>;
  /** @deprecated Use recoilModifier instead. */
  recoil?: Maybe<Scalars['Float']['output']>;
  recoilModifier?: Maybe<Scalars['Float']['output']>;
  ricochetChance?: Maybe<Scalars['Float']['output']>;
  stackMaxSize?: Maybe<Scalars['Int']['output']>;
  staminaBurnPerDamage?: Maybe<Scalars['Float']['output']>;
  tracer?: Maybe<Scalars['Boolean']['output']>;
  tracerColor?: Maybe<Scalars['String']['output']>;
};

export type ItemPropertiesArmor = {
  __typename?: 'ItemPropertiesArmor';
  armorSlots?: Maybe<Array<Maybe<ItemArmorSlot>>>;
  armorType?: Maybe<Scalars['String']['output']>;
  bluntThroughput?: Maybe<Scalars['Float']['output']>;
  class?: Maybe<Scalars['Int']['output']>;
  durability?: Maybe<Scalars['Int']['output']>;
  ergoPenalty?: Maybe<Scalars['Float']['output']>;
  material?: Maybe<ArmorMaterial>;
  repairCost?: Maybe<Scalars['Int']['output']>;
  speedPenalty?: Maybe<Scalars['Float']['output']>;
  turnPenalty?: Maybe<Scalars['Float']['output']>;
  zones?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ItemPropertiesArmorAttachment = {
  __typename?: 'ItemPropertiesArmorAttachment';
  armorType?: Maybe<Scalars['String']['output']>;
  blindnessProtection?: Maybe<Scalars['Float']['output']>;
  bluntThroughput?: Maybe<Scalars['Float']['output']>;
  class?: Maybe<Scalars['Int']['output']>;
  durability?: Maybe<Scalars['Int']['output']>;
  ergoPenalty?: Maybe<Scalars['Float']['output']>;
  /** @deprecated Use zones instead. */
  headZones?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  material?: Maybe<ArmorMaterial>;
  repairCost?: Maybe<Scalars['Int']['output']>;
  slots?: Maybe<Array<Maybe<ItemSlot>>>;
  speedPenalty?: Maybe<Scalars['Float']['output']>;
  turnPenalty?: Maybe<Scalars['Float']['output']>;
  zones?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ItemPropertiesBackpack = {
  __typename?: 'ItemPropertiesBackpack';
  capacity?: Maybe<Scalars['Int']['output']>;
  ergoPenalty?: Maybe<Scalars['Float']['output']>;
  grids?: Maybe<Array<Maybe<ItemStorageGrid>>>;
  /** @deprecated Use grids instead. */
  pouches?: Maybe<Array<Maybe<ItemStorageGrid>>>;
  speedPenalty?: Maybe<Scalars['Float']['output']>;
  turnPenalty?: Maybe<Scalars['Float']['output']>;
};

export type ItemPropertiesBarrel = {
  __typename?: 'ItemPropertiesBarrel';
  /** @deprecated Use centerOfImpact, deviationCurve, and deviationMax instead. */
  accuracyModifier?: Maybe<Scalars['Float']['output']>;
  centerOfImpact?: Maybe<Scalars['Float']['output']>;
  deviationCurve?: Maybe<Scalars['Float']['output']>;
  deviationMax?: Maybe<Scalars['Float']['output']>;
  ergonomics?: Maybe<Scalars['Float']['output']>;
  /** @deprecated Use recoilModifier instead. */
  recoil?: Maybe<Scalars['Float']['output']>;
  recoilModifier?: Maybe<Scalars['Float']['output']>;
  slots?: Maybe<Array<Maybe<ItemSlot>>>;
};

export type ItemPropertiesChestRig = {
  __typename?: 'ItemPropertiesChestRig';
  armorSlots?: Maybe<Array<Maybe<ItemArmorSlot>>>;
  armorType?: Maybe<Scalars['String']['output']>;
  bluntThroughput?: Maybe<Scalars['Float']['output']>;
  capacity?: Maybe<Scalars['Int']['output']>;
  class?: Maybe<Scalars['Int']['output']>;
  durability?: Maybe<Scalars['Int']['output']>;
  ergoPenalty?: Maybe<Scalars['Float']['output']>;
  grids?: Maybe<Array<Maybe<ItemStorageGrid>>>;
  material?: Maybe<ArmorMaterial>;
  /** @deprecated Use grids instead. */
  pouches?: Maybe<Array<Maybe<ItemStorageGrid>>>;
  repairCost?: Maybe<Scalars['Int']['output']>;
  speedPenalty?: Maybe<Scalars['Float']['output']>;
  turnPenalty?: Maybe<Scalars['Float']['output']>;
  zones?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ItemPropertiesContainer = {
  __typename?: 'ItemPropertiesContainer';
  capacity?: Maybe<Scalars['Int']['output']>;
  grids?: Maybe<Array<Maybe<ItemStorageGrid>>>;
};

export type ItemPropertiesFoodDrink = {
  __typename?: 'ItemPropertiesFoodDrink';
  energy?: Maybe<Scalars['Int']['output']>;
  hydration?: Maybe<Scalars['Int']['output']>;
  stimEffects: Array<Maybe<StimEffect>>;
  units?: Maybe<Scalars['Int']['output']>;
};

export type ItemPropertiesGlasses = {
  __typename?: 'ItemPropertiesGlasses';
  blindnessProtection?: Maybe<Scalars['Float']['output']>;
  bluntThroughput?: Maybe<Scalars['Float']['output']>;
  class?: Maybe<Scalars['Int']['output']>;
  durability?: Maybe<Scalars['Int']['output']>;
  material?: Maybe<ArmorMaterial>;
  repairCost?: Maybe<Scalars['Int']['output']>;
};

export type ItemPropertiesGrenade = {
  __typename?: 'ItemPropertiesGrenade';
  contusionRadius?: Maybe<Scalars['Int']['output']>;
  fragments?: Maybe<Scalars['Int']['output']>;
  fuse?: Maybe<Scalars['Float']['output']>;
  maxExplosionDistance?: Maybe<Scalars['Int']['output']>;
  minExplosionDistance?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type ItemPropertiesHeadphone = {
  __typename?: 'ItemPropertiesHeadphone';
  ambientVolume?: Maybe<Scalars['Int']['output']>;
  compressorAttack?: Maybe<Scalars['Int']['output']>;
  compressorGain?: Maybe<Scalars['Int']['output']>;
  compressorRelease?: Maybe<Scalars['Int']['output']>;
  compressorThreshold?: Maybe<Scalars['Int']['output']>;
  compressorVolume?: Maybe<Scalars['Int']['output']>;
  cutoffFrequency?: Maybe<Scalars['Int']['output']>;
  distanceModifier?: Maybe<Scalars['Float']['output']>;
  distortion?: Maybe<Scalars['Float']['output']>;
  dryVolume?: Maybe<Scalars['Int']['output']>;
  highFrequencyGain?: Maybe<Scalars['Float']['output']>;
  resonance?: Maybe<Scalars['Float']['output']>;
};

export type ItemPropertiesHeadwear = {
  __typename?: 'ItemPropertiesHeadwear';
  slots?: Maybe<Array<Maybe<ItemSlot>>>;
};

export type ItemPropertiesHelmet = {
  __typename?: 'ItemPropertiesHelmet';
  armorSlots?: Maybe<Array<Maybe<ItemArmorSlot>>>;
  armorType?: Maybe<Scalars['String']['output']>;
  blindnessProtection?: Maybe<Scalars['Float']['output']>;
  blocksHeadset?: Maybe<Scalars['Boolean']['output']>;
  bluntThroughput?: Maybe<Scalars['Float']['output']>;
  class?: Maybe<Scalars['Int']['output']>;
  deafening?: Maybe<Scalars['String']['output']>;
  durability?: Maybe<Scalars['Int']['output']>;
  ergoPenalty?: Maybe<Scalars['Float']['output']>;
  headZones?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  material?: Maybe<ArmorMaterial>;
  repairCost?: Maybe<Scalars['Int']['output']>;
  ricochetX?: Maybe<Scalars['Float']['output']>;
  ricochetY?: Maybe<Scalars['Float']['output']>;
  ricochetZ?: Maybe<Scalars['Float']['output']>;
  slots?: Maybe<Array<Maybe<ItemSlot>>>;
  speedPenalty?: Maybe<Scalars['Float']['output']>;
  turnPenalty?: Maybe<Scalars['Float']['output']>;
};

export type ItemPropertiesKey = {
  __typename?: 'ItemPropertiesKey';
  uses?: Maybe<Scalars['Int']['output']>;
};

export type ItemPropertiesMagazine = {
  __typename?: 'ItemPropertiesMagazine';
  allowedAmmo?: Maybe<Array<Maybe<Item>>>;
  ammoCheckModifier?: Maybe<Scalars['Float']['output']>;
  capacity?: Maybe<Scalars['Int']['output']>;
  ergonomics?: Maybe<Scalars['Float']['output']>;
  loadModifier?: Maybe<Scalars['Float']['output']>;
  malfunctionChance?: Maybe<Scalars['Float']['output']>;
  /** @deprecated Use recoilModifier instead. */
  recoil?: Maybe<Scalars['Float']['output']>;
  recoilModifier?: Maybe<Scalars['Float']['output']>;
  slots?: Maybe<Array<Maybe<ItemSlot>>>;
};

export type ItemPropertiesMedKit = {
  __typename?: 'ItemPropertiesMedKit';
  cures?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  hitpoints?: Maybe<Scalars['Int']['output']>;
  hpCostHeavyBleeding?: Maybe<Scalars['Int']['output']>;
  hpCostLightBleeding?: Maybe<Scalars['Int']['output']>;
  maxHealPerUse?: Maybe<Scalars['Int']['output']>;
  useTime?: Maybe<Scalars['Int']['output']>;
};

export type ItemPropertiesMedicalItem = {
  __typename?: 'ItemPropertiesMedicalItem';
  cures?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  useTime?: Maybe<Scalars['Int']['output']>;
  uses?: Maybe<Scalars['Int']['output']>;
};

export type ItemPropertiesMelee = {
  __typename?: 'ItemPropertiesMelee';
  hitRadius?: Maybe<Scalars['Float']['output']>;
  slashDamage?: Maybe<Scalars['Int']['output']>;
  stabDamage?: Maybe<Scalars['Int']['output']>;
};

export type ItemPropertiesNightVision = {
  __typename?: 'ItemPropertiesNightVision';
  diffuseIntensity?: Maybe<Scalars['Float']['output']>;
  intensity?: Maybe<Scalars['Float']['output']>;
  noiseIntensity?: Maybe<Scalars['Float']['output']>;
  noiseScale?: Maybe<Scalars['Float']['output']>;
};

export type ItemPropertiesPainkiller = {
  __typename?: 'ItemPropertiesPainkiller';
  cures?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  energyImpact?: Maybe<Scalars['Int']['output']>;
  hydrationImpact?: Maybe<Scalars['Int']['output']>;
  painkillerDuration?: Maybe<Scalars['Int']['output']>;
  useTime?: Maybe<Scalars['Int']['output']>;
  uses?: Maybe<Scalars['Int']['output']>;
};

export type ItemPropertiesPreset = {
  __typename?: 'ItemPropertiesPreset';
  baseItem: Item;
  default?: Maybe<Scalars['Boolean']['output']>;
  ergonomics?: Maybe<Scalars['Float']['output']>;
  moa?: Maybe<Scalars['Float']['output']>;
  recoilHorizontal?: Maybe<Scalars['Int']['output']>;
  recoilVertical?: Maybe<Scalars['Int']['output']>;
};

export type ItemPropertiesResource = {
  __typename?: 'ItemPropertiesResource';
  units?: Maybe<Scalars['Int']['output']>;
};

export type ItemPropertiesScope = {
  __typename?: 'ItemPropertiesScope';
  ergonomics?: Maybe<Scalars['Float']['output']>;
  /** @deprecated Use recoilModifier instead. */
  recoil?: Maybe<Scalars['Float']['output']>;
  recoilModifier?: Maybe<Scalars['Float']['output']>;
  sightModes?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  sightingRange?: Maybe<Scalars['Int']['output']>;
  slots?: Maybe<Array<Maybe<ItemSlot>>>;
  zoomLevels?: Maybe<Array<Maybe<Array<Maybe<Scalars['Float']['output']>>>>>;
};

export type ItemPropertiesStim = {
  __typename?: 'ItemPropertiesStim';
  cures?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  stimEffects: Array<Maybe<StimEffect>>;
  useTime?: Maybe<Scalars['Int']['output']>;
};

export type ItemPropertiesSurgicalKit = {
  __typename?: 'ItemPropertiesSurgicalKit';
  cures?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  maxLimbHealth?: Maybe<Scalars['Float']['output']>;
  minLimbHealth?: Maybe<Scalars['Float']['output']>;
  useTime?: Maybe<Scalars['Int']['output']>;
  uses?: Maybe<Scalars['Int']['output']>;
};

export type ItemPropertiesWeapon = {
  __typename?: 'ItemPropertiesWeapon';
  allowedAmmo?: Maybe<Array<Maybe<Item>>>;
  caliber?: Maybe<Scalars['String']['output']>;
  cameraRecoil?: Maybe<Scalars['Float']['output']>;
  cameraSnap?: Maybe<Scalars['Float']['output']>;
  centerOfImpact?: Maybe<Scalars['Float']['output']>;
  convergence?: Maybe<Scalars['Float']['output']>;
  defaultAmmo?: Maybe<Item>;
  defaultErgonomics?: Maybe<Scalars['Float']['output']>;
  defaultHeight?: Maybe<Scalars['Int']['output']>;
  defaultPreset?: Maybe<Item>;
  defaultRecoilHorizontal?: Maybe<Scalars['Int']['output']>;
  defaultRecoilVertical?: Maybe<Scalars['Int']['output']>;
  defaultWeight?: Maybe<Scalars['Float']['output']>;
  defaultWidth?: Maybe<Scalars['Int']['output']>;
  deviationCurve?: Maybe<Scalars['Float']['output']>;
  deviationMax?: Maybe<Scalars['Float']['output']>;
  effectiveDistance?: Maybe<Scalars['Int']['output']>;
  ergonomics?: Maybe<Scalars['Float']['output']>;
  fireModes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  fireRate?: Maybe<Scalars['Int']['output']>;
  maxDurability?: Maybe<Scalars['Int']['output']>;
  presets?: Maybe<Array<Maybe<Item>>>;
  recoilAngle?: Maybe<Scalars['Int']['output']>;
  recoilDispersion?: Maybe<Scalars['Int']['output']>;
  recoilHorizontal?: Maybe<Scalars['Int']['output']>;
  recoilVertical?: Maybe<Scalars['Int']['output']>;
  repairCost?: Maybe<Scalars['Int']['output']>;
  sightingRange?: Maybe<Scalars['Int']['output']>;
  slots?: Maybe<Array<Maybe<ItemSlot>>>;
};

export type ItemPropertiesWeaponMod = {
  __typename?: 'ItemPropertiesWeaponMod';
  accuracyModifier?: Maybe<Scalars['Float']['output']>;
  ergonomics?: Maybe<Scalars['Float']['output']>;
  /** @deprecated Use recoilModifier instead. */
  recoil?: Maybe<Scalars['Float']['output']>;
  recoilModifier?: Maybe<Scalars['Float']['output']>;
  slots?: Maybe<Array<Maybe<ItemSlot>>>;
};

export type ItemSlot = {
  __typename?: 'ItemSlot';
  filters?: Maybe<ItemFilters>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nameId: Scalars['String']['output'];
  required?: Maybe<Scalars['Boolean']['output']>;
};

export enum ItemSourceName {
  Fence = 'fence',
  FleaMarket = 'fleaMarket',
  Jaeger = 'jaeger',
  Mechanic = 'mechanic',
  Peacekeeper = 'peacekeeper',
  Prapor = 'prapor',
  Ragman = 'ragman',
  Ref = 'ref',
  Skier = 'skier',
  Therapist = 'therapist'
}

export type ItemStorageGrid = {
  __typename?: 'ItemStorageGrid';
  filters: ItemFilters;
  height: Scalars['Int']['output'];
  width: Scalars['Int']['output'];
};

/**
 * The below types are all deprecated and may not return current data.
 * ItemTranslation has been replaced with the lang argument on all queries
 */
export type ItemTranslation = {
  __typename?: 'ItemTranslation';
  /** @deprecated Use the lang argument on queries instead. */
  description?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use the lang argument on queries instead. */
  name?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use the lang argument on queries instead. */
  shortName?: Maybe<Scalars['String']['output']>;
};

export enum ItemType {
  Ammo = 'ammo',
  AmmoBox = 'ammoBox',
  Any = 'any',
  Armor = 'armor',
  ArmorPlate = 'armorPlate',
  Backpack = 'backpack',
  Barter = 'barter',
  Container = 'container',
  Glasses = 'glasses',
  Grenade = 'grenade',
  Gun = 'gun',
  Headphones = 'headphones',
  Helmet = 'helmet',
  Injectors = 'injectors',
  Keys = 'keys',
  MarkedOnly = 'markedOnly',
  Meds = 'meds',
  Mods = 'mods',
  NoFlea = 'noFlea',
  PistolGrip = 'pistolGrip',
  Preset = 'preset',
  Provisions = 'provisions',
  Rig = 'rig',
  Suppressor = 'suppressor',
  Wearable = 'wearable'
}

export enum LanguageCode {
  Cs = 'cs',
  De = 'de',
  En = 'en',
  Es = 'es',
  Fr = 'fr',
  Hu = 'hu',
  It = 'it',
  Ja = 'ja',
  Ko = 'ko',
  Pl = 'pl',
  Pt = 'pt',
  Ru = 'ru',
  Sk = 'sk',
  Tr = 'tr',
  Zh = 'zh'
}

export type Lock = {
  __typename?: 'Lock';
  bottom?: Maybe<Scalars['Float']['output']>;
  key?: Maybe<Item>;
  lockType?: Maybe<Scalars['String']['output']>;
  needsPower?: Maybe<Scalars['Boolean']['output']>;
  outline?: Maybe<Array<Maybe<MapPosition>>>;
  position?: Maybe<MapPosition>;
  top?: Maybe<Scalars['Float']['output']>;
};

export type LootContainer = {
  __typename?: 'LootContainer';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  normalizedName: Scalars['String']['output'];
};

export type LootContainerPosition = {
  __typename?: 'LootContainerPosition';
  lootContainer?: Maybe<LootContainer>;
  position?: Maybe<MapPosition>;
};

export type Map = {
  __typename?: 'Map';
  accessKeys: Array<Maybe<Item>>;
  accessKeysMinPlayerLevel?: Maybe<Scalars['Int']['output']>;
  bosses: Array<Maybe<BossSpawn>>;
  description?: Maybe<Scalars['String']['output']>;
  enemies?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  extracts?: Maybe<Array<Maybe<MapExtract>>>;
  hazards?: Maybe<Array<Maybe<MapHazard>>>;
  id: Scalars['ID']['output'];
  locks?: Maybe<Array<Maybe<Lock>>>;
  lootContainers?: Maybe<Array<Maybe<LootContainerPosition>>>;
  maxPlayerLevel?: Maybe<Scalars['Int']['output']>;
  minPlayerLevel?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  nameId?: Maybe<Scalars['String']['output']>;
  normalizedName: Scalars['String']['output'];
  players?: Maybe<Scalars['String']['output']>;
  raidDuration?: Maybe<Scalars['Int']['output']>;
  spawns?: Maybe<Array<Maybe<MapSpawn>>>;
  stationaryWeapons?: Maybe<Array<Maybe<StationaryWeaponPosition>>>;
  switches?: Maybe<Array<Maybe<MapSwitch>>>;
  tarkovDataId?: Maybe<Scalars['ID']['output']>;
  wiki?: Maybe<Scalars['String']['output']>;
};

export type MapExtract = {
  __typename?: 'MapExtract';
  bottom?: Maybe<Scalars['Float']['output']>;
  faction?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  outline?: Maybe<Array<Maybe<MapPosition>>>;
  position?: Maybe<MapPosition>;
  switches?: Maybe<Array<Maybe<MapSwitch>>>;
  top?: Maybe<Scalars['Float']['output']>;
};

export type MapHazard = {
  __typename?: 'MapHazard';
  bottom?: Maybe<Scalars['Float']['output']>;
  hazardType?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  outline?: Maybe<Array<Maybe<MapPosition>>>;
  position?: Maybe<MapPosition>;
  top?: Maybe<Scalars['Float']['output']>;
};

export type MapPosition = {
  __typename?: 'MapPosition';
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
  z: Scalars['Float']['output'];
};

export type MapSpawn = {
  __typename?: 'MapSpawn';
  categories?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  position: MapPosition;
  sides?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  zoneName?: Maybe<Scalars['String']['output']>;
};

export type MapSwitch = {
  __typename?: 'MapSwitch';
  activatedBy?: Maybe<MapSwitch>;
  activates?: Maybe<Array<Maybe<MapSwitchOperation>>>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  position?: Maybe<MapPosition>;
  switchType?: Maybe<Scalars['String']['output']>;
};

export type MapSwitchOperation = {
  __typename?: 'MapSwitchOperation';
  operation?: Maybe<Scalars['String']['output']>;
  target?: Maybe<MapSwitchTarget>;
};

export type MapSwitchTarget = MapExtract | MapSwitch;

export type MapWithPosition = {
  __typename?: 'MapWithPosition';
  map?: Maybe<Map>;
  positions?: Maybe<Array<Maybe<MapPosition>>>;
};

export type Mastering = {
  __typename?: 'Mastering';
  id: Scalars['ID']['output'];
  level2?: Maybe<Scalars['Int']['output']>;
  level3?: Maybe<Scalars['Int']['output']>;
  weapons: Array<Maybe<Item>>;
};

export type MobInfo = {
  __typename?: 'MobInfo';
  /** equipment and items are estimates and may be inaccurate. */
  equipment: Array<Maybe<ContainedItem>>;
  health?: Maybe<Array<Maybe<HealthPart>>>;
  id: Scalars['ID']['output'];
  imagePortraitLink?: Maybe<Scalars['String']['output']>;
  imagePosterLink?: Maybe<Scalars['String']['output']>;
  items: Array<Maybe<Item>>;
  name: Scalars['String']['output'];
  normalizedName: Scalars['String']['output'];
};

export type NumberCompare = {
  __typename?: 'NumberCompare';
  compareMethod: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type OfferUnlock = {
  __typename?: 'OfferUnlock';
  id: Scalars['ID']['output'];
  item: Item;
  level: Scalars['Int']['output'];
  trader: Trader;
};

export type PlayerLevel = {
  __typename?: 'PlayerLevel';
  exp: Scalars['Int']['output'];
  level: Scalars['Int']['output'];
};

export type PriceRequirement = {
  __typename?: 'PriceRequirement';
  stringValue?: Maybe<Scalars['String']['output']>;
  type: RequirementType;
  value?: Maybe<Scalars['Int']['output']>;
};

export type Query = {
  __typename?: 'Query';
  achievements: Array<Maybe<Achievement>>;
  ammo?: Maybe<Array<Maybe<Ammo>>>;
  armorMaterials: Array<Maybe<ArmorMaterial>>;
  barters?: Maybe<Array<Maybe<Barter>>>;
  bosses?: Maybe<Array<Maybe<MobInfo>>>;
  crafts?: Maybe<Array<Maybe<Craft>>>;
  fleaMarket: FleaMarket;
  goonReports: Array<Maybe<GoonReport>>;
  handbookCategories: Array<Maybe<ItemCategory>>;
  /** @deprecated Use hideoutStations instead. */
  hideoutModules?: Maybe<Array<Maybe<HideoutModule>>>;
  hideoutStations: Array<Maybe<HideoutStation>>;
  historicalItemPrices: Array<Maybe<HistoricalPricePoint>>;
  item?: Maybe<Item>;
  /** @deprecated Use item instead. */
  itemByNormalizedName?: Maybe<Item>;
  itemCategories: Array<Maybe<ItemCategory>>;
  items: Array<Maybe<Item>>;
  /** @deprecated Use items instead. */
  itemsByBsgCategoryId: Array<Maybe<Item>>;
  /** @deprecated Use items instead. */
  itemsByIDs?: Maybe<Array<Maybe<Item>>>;
  /** @deprecated Use items instead. */
  itemsByName: Array<Maybe<Item>>;
  /** @deprecated Use items instead. */
  itemsByType: Array<Maybe<Item>>;
  lootContainers?: Maybe<Array<Maybe<LootContainer>>>;
  maps: Array<Maybe<Map>>;
  mastering: Array<Maybe<Mastering>>;
  playerLevels: Array<Maybe<PlayerLevel>>;
  questItems?: Maybe<Array<Maybe<QuestItem>>>;
  /** @deprecated Use tasks instead. */
  quests?: Maybe<Array<Maybe<Quest>>>;
  skills: Array<Maybe<Skill>>;
  stationaryWeapons?: Maybe<Array<Maybe<StationaryWeapon>>>;
  status: ServerStatus;
  task?: Maybe<Task>;
  tasks: Array<Maybe<Task>>;
  /** @deprecated Use traders instead. */
  traderResetTimes?: Maybe<Array<Maybe<TraderResetTime>>>;
  traders: Array<Maybe<Trader>>;
};


export type QueryAchievementsArgs = {
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAmmoArgs = {
  gameMode?: InputMaybe<GameMode>;
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryArmorMaterialsArgs = {
  lang?: InputMaybe<LanguageCode>;
};


export type QueryBartersArgs = {
  gameMode?: InputMaybe<GameMode>;
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryBossesArgs = {
  gameMode?: InputMaybe<GameMode>;
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Array<Scalars['String']['input']>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCraftsArgs = {
  gameMode?: InputMaybe<GameMode>;
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFleaMarketArgs = {
  gameMode?: InputMaybe<GameMode>;
  lang?: InputMaybe<LanguageCode>;
};


export type QueryGoonReportsArgs = {
  gameMode?: InputMaybe<GameMode>;
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  ofset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryHandbookCategoriesArgs = {
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryHideoutStationsArgs = {
  gameMode?: InputMaybe<GameMode>;
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryHistoricalItemPricesArgs = {
  days?: InputMaybe<Scalars['Int']['input']>;
  gameMode?: InputMaybe<GameMode>;
  id: Scalars['ID']['input'];
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryItemArgs = {
  gameMode?: InputMaybe<GameMode>;
  id?: InputMaybe<Scalars['ID']['input']>;
  lang?: InputMaybe<LanguageCode>;
  normalizedName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryItemByNormalizedNameArgs = {
  normalizedName: Scalars['String']['input'];
};


export type QueryItemCategoriesArgs = {
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryItemsArgs = {
  bsgCategory?: InputMaybe<Scalars['String']['input']>;
  bsgCategoryId?: InputMaybe<Scalars['String']['input']>;
  bsgCategoryIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  categoryNames?: InputMaybe<Array<InputMaybe<ItemCategoryName>>>;
  gameMode?: InputMaybe<GameMode>;
  handbookCategoryNames?: InputMaybe<Array<InputMaybe<HandbookCategoryName>>>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  names?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<ItemType>;
  types?: InputMaybe<Array<InputMaybe<ItemType>>>;
};


export type QueryItemsByBsgCategoryIdArgs = {
  bsgCategoryId: Scalars['String']['input'];
};


export type QueryItemsByIDsArgs = {
  ids: Array<InputMaybe<Scalars['ID']['input']>>;
};


export type QueryItemsByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryItemsByTypeArgs = {
  type: ItemType;
};


export type QueryLootContainersArgs = {
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMapsArgs = {
  enemies?: InputMaybe<Array<Scalars['String']['input']>>;
  gameMode?: InputMaybe<GameMode>;
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Array<Scalars['String']['input']>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMasteringArgs = {
  lang?: InputMaybe<LanguageCode>;
};


export type QueryQuestItemsArgs = {
  lang?: InputMaybe<LanguageCode>;
};


export type QuerySkillsArgs = {
  lang?: InputMaybe<LanguageCode>;
};


export type QueryStationaryWeaponsArgs = {
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTaskArgs = {
  gameMode?: InputMaybe<GameMode>;
  id: Scalars['ID']['input'];
  lang?: InputMaybe<LanguageCode>;
};


export type QueryTasksArgs = {
  faction?: InputMaybe<Scalars['String']['input']>;
  gameMode?: InputMaybe<GameMode>;
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTradersArgs = {
  gameMode?: InputMaybe<GameMode>;
  lang?: InputMaybe<LanguageCode>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Quest has been replaced with Task. */
export type Quest = {
  __typename?: 'Quest';
  /** @deprecated Use Task type instead. */
  exp: Scalars['Int']['output'];
  /** @deprecated Use Task type instead. */
  giver: Trader;
  /** @deprecated Use Task type instead. */
  id: Scalars['String']['output'];
  /** @deprecated Use Task type instead. */
  objectives: Array<Maybe<QuestObjective>>;
  /** @deprecated Use Task type instead. */
  reputation?: Maybe<Array<QuestRewardReputation>>;
  /** @deprecated Use Task type instead. */
  requirements?: Maybe<QuestRequirement>;
  /** @deprecated Use Task type instead. */
  title: Scalars['String']['output'];
  /** @deprecated Use Task type instead. */
  turnin: Trader;
  /** @deprecated Use Task type instead. */
  unlocks: Array<Maybe<Scalars['String']['output']>>;
  /** @deprecated Use Task type instead. */
  wikiLink: Scalars['String']['output'];
};

export type QuestItem = {
  __typename?: 'QuestItem';
  baseImageLink?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  gridImageLink?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  iconLink?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  image8xLink?: Maybe<Scalars['String']['output']>;
  image512pxLink?: Maybe<Scalars['String']['output']>;
  inspectImageLink?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  normalizedName?: Maybe<Scalars['String']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  width?: Maybe<Scalars['Int']['output']>;
};

/** QuestObjective has been replaced with TaskObjective. */
export type QuestObjective = {
  __typename?: 'QuestObjective';
  /** @deprecated Use Task type instead. */
  id?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use Task type instead. */
  location?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use Task type instead. */
  number?: Maybe<Scalars['Int']['output']>;
  /** @deprecated Use Task type instead. */
  target?: Maybe<Array<Scalars['String']['output']>>;
  /** @deprecated Use Task type instead. */
  targetItem?: Maybe<Item>;
  /** @deprecated Use Task type instead. */
  type: Scalars['String']['output'];
};

/** QuestRequirement has been replaced with TaskRequirement. */
export type QuestRequirement = {
  __typename?: 'QuestRequirement';
  /** @deprecated Use Task type instead. */
  level?: Maybe<Scalars['Int']['output']>;
  /** @deprecated Use Task type instead. */
  prerequisiteQuests: Array<Maybe<Array<Maybe<Quest>>>>;
  /** @deprecated Use Task type instead. */
  quests: Array<Maybe<Array<Maybe<Scalars['Int']['output']>>>>;
};

export type QuestRewardReputation = {
  __typename?: 'QuestRewardReputation';
  /** @deprecated Use Task type instead. */
  amount: Scalars['Float']['output'];
  /** @deprecated Use Task type instead. */
  trader: Trader;
};

export type RequirementHideoutStationLevel = {
  __typename?: 'RequirementHideoutStationLevel';
  id?: Maybe<Scalars['ID']['output']>;
  level: Scalars['Int']['output'];
  station: HideoutStation;
};

export type RequirementItem = {
  __typename?: 'RequirementItem';
  attributes?: Maybe<Array<Maybe<ItemAttribute>>>;
  count: Scalars['Int']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  item: Item;
  quantity: Scalars['Int']['output'];
};

export type RequirementSkill = {
  __typename?: 'RequirementSkill';
  id?: Maybe<Scalars['ID']['output']>;
  level: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  skill: Skill;
};

export type RequirementTask = {
  __typename?: 'RequirementTask';
  id?: Maybe<Scalars['ID']['output']>;
  task: Task;
};

export type RequirementTrader = {
  __typename?: 'RequirementTrader';
  compareMethod?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  /** @deprecated Use value instead. */
  level?: Maybe<Scalars['Int']['output']>;
  requirementType?: Maybe<Scalars['String']['output']>;
  trader: Trader;
  value?: Maybe<Scalars['Int']['output']>;
};

export enum RequirementType {
  LoyaltyLevel = 'loyaltyLevel',
  PlayerLevel = 'playerLevel',
  QuestCompleted = 'questCompleted',
  StationLevel = 'stationLevel'
}

export type ServerStatus = {
  __typename?: 'ServerStatus';
  currentStatuses?: Maybe<Array<Maybe<Status>>>;
  generalStatus?: Maybe<Status>;
  messages?: Maybe<Array<Maybe<StatusMessage>>>;
};

export type Skill = {
  __typename?: 'Skill';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type SkillLevel = {
  __typename?: 'SkillLevel';
  level: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  skill: Skill;
};

export type StationaryWeapon = {
  __typename?: 'StationaryWeapon';
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
};

export type StationaryWeaponPosition = {
  __typename?: 'StationaryWeaponPosition';
  position?: Maybe<MapPosition>;
  stationaryWeapon?: Maybe<StationaryWeapon>;
};

export type Status = {
  __typename?: 'Status';
  message?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  status: Scalars['Int']['output'];
  statusCode: Scalars['String']['output'];
};

export enum StatusCode {
  Down = 'Down',
  Ok = 'OK',
  Unstable = 'Unstable',
  Updating = 'Updating'
}

export type StatusMessage = {
  __typename?: 'StatusMessage';
  content: Scalars['String']['output'];
  solveTime?: Maybe<Scalars['String']['output']>;
  statusCode: Scalars['String']['output'];
  time: Scalars['String']['output'];
  type: Scalars['Int']['output'];
};

export type StimEffect = {
  __typename?: 'StimEffect';
  chance: Scalars['Float']['output'];
  delay: Scalars['Int']['output'];
  duration: Scalars['Int']['output'];
  percent: Scalars['Boolean']['output'];
  skill?: Maybe<Skill>;
  skillName?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type Task = {
  __typename?: 'Task';
  descriptionMessageId?: Maybe<Scalars['String']['output']>;
  experience: Scalars['Int']['output'];
  factionName?: Maybe<Scalars['String']['output']>;
  failConditions: Array<Maybe<TaskObjective>>;
  failMessageId?: Maybe<Scalars['String']['output']>;
  failureOutcome?: Maybe<TaskRewards>;
  finishRewards?: Maybe<TaskRewards>;
  id?: Maybe<Scalars['ID']['output']>;
  kappaRequired?: Maybe<Scalars['Boolean']['output']>;
  lightkeeperRequired?: Maybe<Scalars['Boolean']['output']>;
  map?: Maybe<Map>;
  minPlayerLevel?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  /** @deprecated Use requiredKeys on objectives instead. */
  neededKeys?: Maybe<Array<Maybe<TaskKey>>>;
  normalizedName: Scalars['String']['output'];
  objectives: Array<Maybe<TaskObjective>>;
  restartable?: Maybe<Scalars['Boolean']['output']>;
  startMessageId?: Maybe<Scalars['String']['output']>;
  startRewards?: Maybe<TaskRewards>;
  successMessageId?: Maybe<Scalars['String']['output']>;
  tarkovDataId?: Maybe<Scalars['Int']['output']>;
  taskImageLink?: Maybe<Scalars['String']['output']>;
  taskRequirements: Array<Maybe<TaskStatusRequirement>>;
  trader: Trader;
  /** @deprecated Use traderRequirements instead. */
  traderLevelRequirements: Array<Maybe<RequirementTrader>>;
  traderRequirements: Array<Maybe<RequirementTrader>>;
  wikiLink?: Maybe<Scalars['String']['output']>;
};

export type TaskKey = {
  __typename?: 'TaskKey';
  keys: Array<Maybe<Item>>;
  map?: Maybe<Map>;
};

export type TaskObjective = {
  description: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  maps: Array<Maybe<Map>>;
  optional: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
};

export type TaskObjectiveBasic = TaskObjective & {
  __typename?: 'TaskObjectiveBasic';
  description: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  maps: Array<Maybe<Map>>;
  optional: Scalars['Boolean']['output'];
  requiredKeys?: Maybe<Array<Maybe<Array<Maybe<Item>>>>>;
  type: Scalars['String']['output'];
  zones?: Maybe<Array<Maybe<TaskZone>>>;
};

export type TaskObjectiveBuildItem = TaskObjective & {
  __typename?: 'TaskObjectiveBuildItem';
  attributes: Array<Maybe<AttributeThreshold>>;
  containsAll: Array<Maybe<Item>>;
  containsCategory: Array<Maybe<ItemCategory>>;
  /** @deprecated Use containsCategory instead. */
  containsOne: Array<Maybe<Item>>;
  description: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  item: Item;
  maps: Array<Maybe<Map>>;
  optional: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
};

export type TaskObjectiveExperience = TaskObjective & {
  __typename?: 'TaskObjectiveExperience';
  count: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  healthEffect: HealthEffect;
  id?: Maybe<Scalars['ID']['output']>;
  maps: Array<Maybe<Map>>;
  optional: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
};

export type TaskObjectiveExtract = TaskObjective & {
  __typename?: 'TaskObjectiveExtract';
  count: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  exitName?: Maybe<Scalars['String']['output']>;
  exitStatus: Array<Maybe<Scalars['String']['output']>>;
  id?: Maybe<Scalars['ID']['output']>;
  maps: Array<Maybe<Map>>;
  optional: Scalars['Boolean']['output'];
  requiredKeys?: Maybe<Array<Maybe<Array<Maybe<Item>>>>>;
  type: Scalars['String']['output'];
  zoneNames: Array<Maybe<Scalars['String']['output']>>;
};

export type TaskObjectiveItem = TaskObjective & {
  __typename?: 'TaskObjectiveItem';
  count: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  dogTagLevel?: Maybe<Scalars['Int']['output']>;
  foundInRaid: Scalars['Boolean']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  item: Item;
  items: Array<Maybe<Item>>;
  maps: Array<Maybe<Map>>;
  maxDurability?: Maybe<Scalars['Int']['output']>;
  minDurability?: Maybe<Scalars['Int']['output']>;
  optional: Scalars['Boolean']['output'];
  requiredKeys?: Maybe<Array<Maybe<Array<Maybe<Item>>>>>;
  type: Scalars['String']['output'];
  zones?: Maybe<Array<Maybe<TaskZone>>>;
};

export type TaskObjectiveMark = TaskObjective & {
  __typename?: 'TaskObjectiveMark';
  description: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  maps: Array<Maybe<Map>>;
  markerItem: Item;
  optional: Scalars['Boolean']['output'];
  requiredKeys?: Maybe<Array<Maybe<Array<Maybe<Item>>>>>;
  type: Scalars['String']['output'];
  zones?: Maybe<Array<Maybe<TaskZone>>>;
};

export type TaskObjectivePlayerLevel = TaskObjective & {
  __typename?: 'TaskObjectivePlayerLevel';
  description: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  maps: Array<Maybe<Map>>;
  optional: Scalars['Boolean']['output'];
  playerLevel: Scalars['Int']['output'];
  type: Scalars['String']['output'];
};

export type TaskObjectiveQuestItem = TaskObjective & {
  __typename?: 'TaskObjectiveQuestItem';
  count: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  maps: Array<Maybe<Map>>;
  optional: Scalars['Boolean']['output'];
  possibleLocations?: Maybe<Array<Maybe<MapWithPosition>>>;
  questItem: QuestItem;
  requiredKeys?: Maybe<Array<Maybe<Array<Maybe<Item>>>>>;
  type: Scalars['String']['output'];
  zones?: Maybe<Array<Maybe<TaskZone>>>;
};

export type TaskObjectiveShoot = TaskObjective & {
  __typename?: 'TaskObjectiveShoot';
  bodyParts: Array<Maybe<Scalars['String']['output']>>;
  count: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  distance?: Maybe<NumberCompare>;
  enemyHealthEffect?: Maybe<HealthEffect>;
  id?: Maybe<Scalars['ID']['output']>;
  maps: Array<Maybe<Map>>;
  notWearing?: Maybe<Array<Maybe<Item>>>;
  optional: Scalars['Boolean']['output'];
  playerHealthEffect?: Maybe<HealthEffect>;
  requiredKeys?: Maybe<Array<Maybe<Array<Maybe<Item>>>>>;
  shotType: Scalars['String']['output'];
  /** @deprecated Use targetNames instead. */
  target: Scalars['String']['output'];
  targetNames: Array<Maybe<Scalars['String']['output']>>;
  timeFromHour?: Maybe<Scalars['Int']['output']>;
  timeUntilHour?: Maybe<Scalars['Int']['output']>;
  type: Scalars['String']['output'];
  usingWeapon?: Maybe<Array<Maybe<Item>>>;
  usingWeaponMods?: Maybe<Array<Maybe<Array<Maybe<Item>>>>>;
  wearing?: Maybe<Array<Maybe<Array<Maybe<Item>>>>>;
  zoneNames: Array<Maybe<Scalars['String']['output']>>;
  zones?: Maybe<Array<Maybe<TaskZone>>>;
};

export type TaskObjectiveSkill = TaskObjective & {
  __typename?: 'TaskObjectiveSkill';
  description: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  maps: Array<Maybe<Map>>;
  optional: Scalars['Boolean']['output'];
  skillLevel: SkillLevel;
  type: Scalars['String']['output'];
};

export type TaskObjectiveTaskStatus = TaskObjective & {
  __typename?: 'TaskObjectiveTaskStatus';
  description: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  maps: Array<Maybe<Map>>;
  optional: Scalars['Boolean']['output'];
  status: Array<Maybe<Scalars['String']['output']>>;
  task: Task;
  type: Scalars['String']['output'];
};

export type TaskObjectiveTraderLevel = TaskObjective & {
  __typename?: 'TaskObjectiveTraderLevel';
  description: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  level: Scalars['Int']['output'];
  maps: Array<Maybe<Map>>;
  optional: Scalars['Boolean']['output'];
  trader: Trader;
  type: Scalars['String']['output'];
};

export type TaskObjectiveTraderStanding = TaskObjective & {
  __typename?: 'TaskObjectiveTraderStanding';
  compareMethod: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  maps: Array<Maybe<Map>>;
  optional: Scalars['Boolean']['output'];
  trader: Trader;
  type: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type TaskObjectiveUseItem = TaskObjective & {
  __typename?: 'TaskObjectiveUseItem';
  compareMethod: Scalars['String']['output'];
  count: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  maps: Array<Maybe<Map>>;
  optional: Scalars['Boolean']['output'];
  requiredKeys?: Maybe<Array<Maybe<Array<Maybe<Item>>>>>;
  type: Scalars['String']['output'];
  useAny: Array<Maybe<Item>>;
  zoneNames: Array<Maybe<Scalars['String']['output']>>;
  zones?: Maybe<Array<Maybe<TaskZone>>>;
};

export type TaskRewards = {
  __typename?: 'TaskRewards';
  craftUnlock: Array<Maybe<Craft>>;
  items: Array<Maybe<ContainedItem>>;
  offerUnlock: Array<Maybe<OfferUnlock>>;
  skillLevelReward: Array<Maybe<SkillLevel>>;
  traderStanding: Array<Maybe<TraderStanding>>;
  traderUnlock: Array<Maybe<Trader>>;
};

export type TaskStatusRequirement = {
  __typename?: 'TaskStatusRequirement';
  status: Array<Maybe<Scalars['String']['output']>>;
  task: Task;
};

export type TaskZone = {
  __typename?: 'TaskZone';
  bottom?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  map?: Maybe<Map>;
  outline?: Maybe<Array<Maybe<MapPosition>>>;
  position?: Maybe<MapPosition>;
  top?: Maybe<Scalars['Float']['output']>;
};

export type Trader = {
  __typename?: 'Trader';
  /** barters and cashOffers are only available via the traders query. */
  barters: Array<Maybe<Barter>>;
  cashOffers: Array<Maybe<TraderCashOffer>>;
  currency: Item;
  description?: Maybe<Scalars['String']['output']>;
  discount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  image4xLink?: Maybe<Scalars['String']['output']>;
  imageLink?: Maybe<Scalars['String']['output']>;
  levels: Array<TraderLevel>;
  name: Scalars['String']['output'];
  normalizedName: Scalars['String']['output'];
  reputationLevels: Array<Maybe<TraderReputationLevel>>;
  resetTime?: Maybe<Scalars['String']['output']>;
  tarkovDataId?: Maybe<Scalars['Int']['output']>;
};

export type TraderCashOffer = {
  __typename?: 'TraderCashOffer';
  buyLimit?: Maybe<Scalars['Int']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  currencyItem?: Maybe<Item>;
  item: Item;
  minTraderLevel?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['Int']['output']>;
  priceRUB?: Maybe<Scalars['Int']['output']>;
  taskUnlock?: Maybe<Task>;
};

export type TraderLevel = {
  __typename?: 'TraderLevel';
  /** barters and cashOffers are only available via the traders query. */
  barters: Array<Maybe<Barter>>;
  cashOffers: Array<Maybe<TraderCashOffer>>;
  id: Scalars['ID']['output'];
  image4xLink?: Maybe<Scalars['String']['output']>;
  imageLink?: Maybe<Scalars['String']['output']>;
  insuranceRate?: Maybe<Scalars['Float']['output']>;
  level: Scalars['Int']['output'];
  payRate: Scalars['Float']['output'];
  repairCostMultiplier?: Maybe<Scalars['Float']['output']>;
  requiredCommerce: Scalars['Int']['output'];
  requiredPlayerLevel: Scalars['Int']['output'];
  requiredReputation: Scalars['Float']['output'];
};

export enum TraderName {
  Fence = 'fence',
  Jaeger = 'jaeger',
  Mechanic = 'mechanic',
  Peacekeeper = 'peacekeeper',
  Prapor = 'prapor',
  Ragman = 'ragman',
  Ref = 'ref',
  Skier = 'skier',
  Therapist = 'therapist'
}

export type TraderOffer = Vendor & {
  __typename?: 'TraderOffer';
  buyLimit?: Maybe<Scalars['Int']['output']>;
  minTraderLevel?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  normalizedName: Scalars['String']['output'];
  taskUnlock?: Maybe<Task>;
  trader: Trader;
};

/** TraderPrice is deprecated and replaced with ItemPrice. */
export type TraderPrice = {
  __typename?: 'TraderPrice';
  /** @deprecated Use item.buyFor instead. */
  currency: Scalars['String']['output'];
  /** @deprecated Use item.buyFor instead. */
  price: Scalars['Int']['output'];
  /** @deprecated Use item.buyFor instead. */
  priceRUB: Scalars['Int']['output'];
  /** @deprecated Use item.buyFor instead. */
  trader: Trader;
};

export type TraderReputationLevel = TraderReputationLevelFence;

export type TraderReputationLevelFence = {
  __typename?: 'TraderReputationLevelFence';
  availableScavExtracts?: Maybe<Scalars['Int']['output']>;
  btrCoveringFireDiscount?: Maybe<Scalars['Int']['output']>;
  btrDeliveryDiscount?: Maybe<Scalars['Int']['output']>;
  btrDeliveryGridSize?: Maybe<MapPosition>;
  btrEnabled?: Maybe<Scalars['Boolean']['output']>;
  btrTaxiDiscount?: Maybe<Scalars['Int']['output']>;
  extractPriceModifier?: Maybe<Scalars['Float']['output']>;
  hostileBosses?: Maybe<Scalars['Boolean']['output']>;
  hostileScavs?: Maybe<Scalars['Boolean']['output']>;
  minimumReputation: Scalars['Int']['output'];
  priceModifier?: Maybe<Scalars['Float']['output']>;
  scavAttackSupport?: Maybe<Scalars['Boolean']['output']>;
  scavCaseTimeModifier?: Maybe<Scalars['Float']['output']>;
  scavCooldownModifier?: Maybe<Scalars['Float']['output']>;
  scavEquipmentSpawnChanceModifier?: Maybe<Scalars['Float']['output']>;
  scavFollowChance?: Maybe<Scalars['Float']['output']>;
};

/** TraderResetTime is deprecated and replaced with Trader. */
export type TraderResetTime = {
  __typename?: 'TraderResetTime';
  /** @deprecated Use Trader.name type instead. */
  name?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use Trader.resetTime type instead. */
  resetTimestamp?: Maybe<Scalars['String']['output']>;
};

export type TraderStanding = {
  __typename?: 'TraderStanding';
  standing: Scalars['Float']['output'];
  trader: Trader;
};

export type Vendor = {
  name: Scalars['String']['output'];
  normalizedName: Scalars['String']['output'];
};

export type HistoricalPricePoint = {
  __typename?: 'historicalPricePoint';
  price?: Maybe<Scalars['Int']['output']>;
  priceMin?: Maybe<Scalars['Int']['output']>;
  timestamp?: Maybe<Scalars['String']['output']>;
};
