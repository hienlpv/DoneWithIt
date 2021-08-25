import React, { useContext } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import colorRandom from "random-color";

import Screen from "../components/Screen";
import { ListItem, ListItemSeparator } from "../components/lists";
import colors from "../config/colors";
import Icon from "../components/Icon";
import AuthContext from "../auth/context";
import authStorage from "../auth/storage";

const menuAdminItems = [
  {
    title: "Sản phẩm",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colorRandom().hexString(),
    },
    targetScreen: "Products",
  },
  {
    title: "Loại",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colorRandom().hexString(),
    },
    targetScreen: "Categories",
  },
  {
    title: "Đơn hàng",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colorRandom().hexString(),
    },
    targetScreen: "Orders",
  },
  {
    title: "Thêm sản phẩm",
    icon: {
      name: "plus",
      backgroundColor: colorRandom().hexString(),
    },
    targetScreen: "AddProduct",
  },
];

const menuUserItems = [
  {
    title: "Đơn hàng của tôi",
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
