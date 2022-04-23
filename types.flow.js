// @flow strict

/************\
|* cumcache *|
\************/

declare type Nest<T> = {
	ghost: T,
	store: T, // ew
	set: ({ path: string[], value: any }) => void,
};

declare type CumcacheNest = Nest<{ [string]: Map<string, mixed> }>;

declare type TimeOutFunc = (
	key: string,
	val: mixed,
	time: string,
	since?: number
) => void;

/************\
|* settings *|
\************/

declare type SettingComponent = ({
	k: string,
	depends: ?string,
	children: string,
}) => mixed;

declare type SelectComponent = ({
	k: string,
	options: { value: mixed, label: string }[],
	depends: ?string,
	children: string,
}) => mixed;

declare type DiscordFormText = React$ComponentType<{
	children: string,
}>;

declare type DiscordSwitch = React$ComponentType<{
	checked: boolean,
	disabled: boolean,
	onChange: (value: boolean) => void | boolean,
}>;

declare type DiscordTextInput = React$ComponentType<{
	value: mixed,
	disabled: boolean,
	onChange: (value: mixed) => void | mixed,
}>;

declare type DiscordSingleSelect = React$ComponentType<{
	options: { value: mixed, label: string }[],
	value: mixed,
	isDisabled: boolean,
	onChange: (value: mixed) => void | mixed,
}>;
