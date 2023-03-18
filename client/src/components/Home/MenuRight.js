import { Button, Menu } from "semantic-ui-react";

const MenuRight = () => (
  <Menu inverted pointing secondary size="large">
    <Menu.Item position="right">
      <Button as="a" inverted>
        Log in
      </Button>
      <Button as="a" inverted style={{ marginLeft: "0.5em" }}>
        Sign Up
      </Button>
    </Menu.Item>
  </Menu>
);

export default MenuRight;
