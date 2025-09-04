import { navData } from '@/shared/data/nav-list-data';
import { ModalMode } from '@/shared/types/general';

const useGetRoleMenu = ({}: { mode: ModalMode; roleId?: number }) => {
	// const navList = useAppSelector((state) => state.auth.navList);
	// const { data, loading } =
	//   useFetch<ApiCommonRes<RoleAccessResModel[]>>('/Menu/RoleMenu');
	const navList = navData.result_data.pages;

	return {
		menuData: navList,
		loading: false,
		initialValuesRoleName: '',
	};
};

export default useGetRoleMenu;
