import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import Screen from "../components/Screen";
import { ListItem, ListItemSeparator } from "../components/lists";
import colors from "../config/colors";
import Icon from "../components/Icon";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";
import { getUserInfo } from "../api/auth";

const menuAdminItems = [
  {
    title: "Categories",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.danger,
    },
    targetScreen: "Feed",
  },
  {
    title: "Order List",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.medium,
    },
    targetScreen: "Orders",
  },
  {
    title: "Product List",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
    targetScreen: "Feed",
  },
  {
    title: "Add Product",
    icon: {
      name: "plus",
      backgroundColor: colors.secondary,
    },
    targetScreen: "ListingEdit",
  },
];

const menuUserItems = [
  {
    title: "My Orders",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
    targetScreen: "Orders",
  },
];

function AccountScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    setUser(null);
    authStorage.removeToken();
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={user.name}
          subTitle={user.email}
          IconComponent={
            user.isAdmin ? (
              <Icon name="account-cog" size={80} />
            ) : (
              <Icon name="account" size={80} />
            )
          }
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={user.isAdmin ? menuAdminItems : menuUserItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() =>
                navigation.navigate(item.targetScreen, {
                  user,
                })
              }
            />
          )}
        />
      </View>
      <ListItem
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
        onPress={handleLogout}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
