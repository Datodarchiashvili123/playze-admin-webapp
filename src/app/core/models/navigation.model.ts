export interface NavigationModel {
  icon: string;
  name: string;
  navigate: string;
  selected: string;
  children: NavigationModel[];
}
