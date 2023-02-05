import { LightningElement, api, wire} from 'lwc';
import getAllTeams from '@salesforce/apex/CreateTeamMembers.getAllTeams';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createMember from '@salesforce/apex/CreateTeamMembers.createMember';
import NAME_FIELD from '@salesforce/schema/TeamMember__c.Name';
import SKILLS_FIELD from '@salesforce/schema/TeamMember__c.Skills__c';
import TEAM_MEMBER_TEAM_ID from '@salesforce/schema/TeamMember__c.Team__c';


export default class MemberSkills extends LightningElement {
    name;
    team;
    skills;
    options = [];
    isLoading=true;
    
    
    @api recordId;
    @api objectApiName;

    @wire(getAllTeams)
    teams({data, error}){
        if(data){
            this.options = data.map(data => ({ label: data.Name, value: data.Id }));
        }else if(error){
            console.log(error);
        }
        this.isLoading=false;
    }


    handleChange(event){
        let n = event.target.name;
        let val = event.target.value;
        if(n === 'name'){
            this.name = val;
        }
        else if(n === 'skills'){
            this.skills = val;
        }
        
    }

    handleSelectTeam(event){
        this.team = event.target.value;
    }

    handleSubmit(){
        this.isLoading=true;
        const fields = {};
        fields[NAME_FIELD.fieldApiName] = this.name;
        fields[SKILLS_FIELD.fieldApiName] = this.skills;
        fields[TEAM_MEMBER_TEAM_ID.fieldApiName] = this.team;
        console.log('My name : '+ this.name);
        console.log('My skills : '+ this.skills);
        console.log('team Id : '+ this.team);


        createMember({record: fields})
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Member created: ' +  this.name,
                        variant: 'success',
                    }),
                );
                
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            
            }).finally(()=> {this.isLoading = false; this.name="";
            this.team="";
            this.skills="";})
            
               
            
    }

}