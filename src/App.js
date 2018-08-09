import React, { Component } from "react";

import "./App.css";

import Header from "./components/Header";
import Body from "./components/Body";

import AppSearchProvider from "./app-search/AppSearchProvider";
import AppSearchDriver from "./app-search/AppSearchDriver";
import config from "./config/engine.json";

function getConfig() {
  if (config.engineName) return config;

  if (
    typeof window !== "undefined" &&
    window.appConfig &&
    window.appConfig.engineName
  ) {
    return window.appConfig;
  }
}

function buildSearchOptionsFromConfig(config) {
  const searchFields = (config.fields || []).reduce((acc, n) => {
    acc = acc || {};
    acc[n] = {};
    return acc;
  }, undefined);

  const resultFields = (config.fields || []).reduce((acc, n) => {
    acc = acc || {};
    acc[n] = {
      raw: {},
      snippet: {
        size: 100,
        fallback: true
      }
    };
    return acc;
  }, undefined);

  const facets = (config.facets || []).reduce((acc, n) => {
    acc = acc || {};
    acc[n] = {
      type: "value",
      size: 10
    };
    return acc;
  }, undefined);

  return {
    facets: facets,
    result_fields: resultFields,
    search_fields: searchFields
  };
}

function createDriverFromConfig(config) {
  const { hostIdentifier, searchKey, engineName } = config;
  return new AppSearchDriver({
    hostIdentifier,
    searchKey,
    engineName,
    searchOptions: buildSearchOptionsFromConfig(config)
  });
}

class App extends Component {
  render() {
    const config = getConfig();

    if (!config) return <div>No config found</div>;

    return (
      <AppSearchProvider driver={createDriverFromConfig(config)}>
        <div className="App">
          <div className="App-body">
            <Header />
            <Body />
          </div>
        </div>
      </AppSearchProvider>
    );
  }
}

export default App;
