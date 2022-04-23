// @flow strict

// $FlowExpectedError[cannot-resolve-module]
import { persist } from "@cumcord/pluginData";
// $FlowExpectedError[cannot-resolve-module]
import { useNest } from "@cumcord/utils";
// $FlowExpectedError[cannot-resolve-module]
import { findByDisplayName } from "@cumcord/modules/webpack";

// batchFind is not tree shakable
const FormText /*: (props: mixed) => mixed  */ = findByDisplayName("FormText");
const Switch /*: (props: mixed) => mixed  */ = findByDisplayName("Switch");
const TextInput /*: (props: mixed) => mixed  */ =
	findByDisplayName("TextInput");
const SingleSelect /*: (props: mixed) => mixed  */ = findByDisplayName(
	"Select",
	false
).SingleSelect;

const rowStyles = (depends /*: ?string */) => ({
	display: "flex",
	alignItems: "center",
	gap: ".5rem",
	marginBottom: "1rem",
	marginLeft: depends !== undefined ? "1rem" : 0,
});

export const SSwitch /*: SettingComponent */ = ({ k, depends, children }) => (
	<div style={rowStyles(depends)}>
		<Switch
			checked={persist.ghost[k]}
			disabled={depends !== undefined && !persist.ghost[depends]}
			onChange={(v /*: mixed */) => (persist.store[k] = v)}
		/>
		<FormText>{children}</FormText>
	</div>
);

export const SText /*: SettingComponent */ = ({ k, depends, children }) => (
	<div style={rowStyles(depends)}>
		<TextInput
			value={persist.ghost[k]}
			disabled={depends !== undefined && !persist.ghost[depends]}
			onChange={(v /*: mixed */) => (persist.store[k] = v)}
		/>
		<FormText>{children}</FormText>
	</div>
);

export const SSelect /*: SelectComponent */ = ({
	k,
	options,
	depends,
	children,
}) => (
	<div style={rowStyles(depends)}>
		<SingleSelect
			options={options}
			value={persist.ghost[k]}
			isDisabled={depends !== undefined && !persist.ghost[depends]}
			onChange={(v /*: mixed */) => (persist.store[k] = v)}
		/>
		<FormText>{children}</FormText>
	</div>
);

export const dependPersist =
	(component /*: (mixed) => mixed */) /*: (mixed)=>mixed */ => (props) => {
		useNest(persist);
		return component(props);
	};

export const setDefaults = (
	settings /*: {[string]: mixed} */,
	// $FlowExpectedError[unclear-type]
	nest /*: any */ = persist
) /*: void */ => {
	for (const k in settings)
		if (nest.ghost[k] === undefined) nest.store[k] = settings[k];
};
