public with sharing class CreateTeamMembers {
    public CreateTeamMembers() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Team__c> getAllTeams(){
        return [select Id, Name from Team__c];
    }

    @AuraEnabled
    public static String createMember(TeamMember__c record) {
        
        insert record;
        System.debug(record);
        
        return record.Id;
    }

    @AuraEnabled(cacheable=false)
    public static List<TeamMember__c> getTeamMembersByTeamId(Id teamId){
        try {
            String query = 'Select Id,Name,Skills__c,Team__r.Name from TeamMember__c ';
            String whereClause = '';
            if(teamId != null){
                whereClause = 'where team__c = :teamId ';
            }

            query += whereClause;
            
            return (List<TeamMember__c>)Database.query(query);
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
