// @flow strict

import React from "react";
// $FlowExpectedError[cannot-resolve-module]
import { persist } from "@cumcord/pluginData";
// $FlowExpectedError[cannot-resolve-module]
import { useNest } from "@cumcord/utils";
// $FlowExpectedError[cannot-resolve-module]
import { findByDisplayName } from "@cumcord/modules/webpack";

// batchFind is not tree shakable
const FormText /*: DiscordFormText */ = findByDisplayName("FormText");
const Switch /*: DiscordSwitch */ = findByDisplayName("Switch");
const TextInput /*: DiscordTextInput */ = findByDisplayName("TextInput");
const SingleSelect /*: DiscordSingleSelect */ = findByDisplayName(
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

export const SSwitch /*: SettingComponent */ = ({ k, depends, children }) =>
	React.createElement(
		"div",
		{ style: rowStyles(depends) },
		React.createElement(Switch, {
			checked: persist.ghost[k],
			disabled: depends !== undefined && !persist.ghost[depends],
			onChange: (v) => (persist.store[k] = v),
		}),
		React.createElement(FormText, { children })
	);

export const SText /*: SettingComponent */ = ({ k, depends, children }) =>
	React.createElement(
		"div",
		{ style: rowStyles(depends) },
		React.createElement(TextInput, {
			value: persist.ghost[k],
			disabled: depends !== undefined && !persist.ghost[depends],
			onChange: (v) => (persist.store[k] = v),
		}),
		React.createElement(FormText, { children })
	);

export const SSelect /*: SelectComponent */ = ({
	k,
	options,
	depends,
	children,
}) =>
	React.createElement(
		"div",
		{ style: rowStyles(depends) },
		React.createElement(SingleSelect, {
			options,
			value: persist.ghost[k],
			isDisabled: depends !== undefined && !persist.ghost[depends],
			onChange: (v) => (persist.store[k] = v),
		}),
		React.createElement(FormText, { children })
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
