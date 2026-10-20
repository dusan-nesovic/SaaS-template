export interface IMenuItem {
  label: string;
  icon: string;
  url: string;
  // Visible only to admins; every other item is visible to any signed-in user.
  requiresAdmin?: boolean;
  condition: boolean;
  active: boolean;
}
