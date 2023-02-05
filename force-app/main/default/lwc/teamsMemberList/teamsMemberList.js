import { LightningElement ,wire} from 'lwc';
import getTeamMembersByTeamId from '@salesforce/apex/CreateTeamMembers.getTeamMembersByTeamId';
import { refreshApex } from '@salesforce/apex';
import getAllTeams from '@salesforce/apex/CreateTeamMembers.getAllTeams';

export default class TeamsMemberList extends LightningElement {
    teamList = false;
    teamMembers = [];
    teamOptions = [];
    selectedTeam = null;
    isLoading = true;


    @wire(getTeamMembersByTeamId,{teamId: '$selectedTeam'})
    getTeamMembers({data, error}){
        debugger
        if(data){
            this.teamList = true;
            this.teamMembers = data;
        }else if(error){
            this.teamList = false;
            console.log(error);
        }
        this.isLoading = false;
       
    }

    @wire(getAllTeams)
    teams({data, error}){
        if(data){
            this.teamOptions = data.map(data => ({ label: data.Name, value: data.Id }));
        }else if(error){
            console.log(error);
        }
    }

    handleSelectTeam(event){
        this.isLoading = true;
        this.selectedTeam = event.target.value;
        refreshApex(this.teamMembers);
    }


}